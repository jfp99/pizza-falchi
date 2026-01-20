import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Order from '../models/Order';
import Product from '../models/Product';
import TimeSlot from '../models/TimeSlot';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

async function seedTestOrders() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!');
    console.log('');

    // Get available products
    const pizzas = await Product.find({ category: 'pizza', available: true }).limit(5);
    const boissons = await Product.find({ category: 'boisson', available: true }).limit(3);

    if (pizzas.length === 0) {
      console.error('❌ No pizzas found in database. Run seed:atlas first.');
      process.exit(1);
    }

    // Get available time slots
    const availableSlots = await TimeSlot.find({
      date: { $gte: new Date() },
      isAvailable: true
    }).sort({ date: 1, startTime: 1 }).limit(10);

    if (availableSlots.length === 0) {
      console.error('❌ No time slots found. Run seed:timeslots first.');
      process.exit(1);
    }

    console.log(`📦 Found ${pizzas.length} pizzas and ${boissons.length} drinks`);
    console.log(`🕐 Found ${availableSlots.length} available time slots`);
    console.log('');

    // Create test orders with different statuses
    const testOrders = [
      {
        status: 'pending',
        customerName: 'Jean Dupont',
        customerEmail: 'jean.dupont@example.com',
        customerPhone: '0612345678',
        deliveryType: 'delivery',
        deliveryAddress: {
          street: '123 Rue de la République',
          city: 'Puyricard',
          postalCode: '13540',
          country: 'France'
        }
      },
      {
        status: 'confirmed',
        customerName: 'Marie Martin',
        customerEmail: 'marie.martin@example.com',
        customerPhone: '0623456789',
        deliveryType: 'pickup',
        deliveryAddress: null
      },
      {
        status: 'preparing',
        customerName: 'Pierre Bernard',
        customerEmail: 'pierre.bernard@example.com',
        customerPhone: '0634567890',
        deliveryType: 'delivery',
        deliveryAddress: {
          street: '45 Avenue du Général de Gaulle',
          city: 'Puyricard',
          postalCode: '13540',
          country: 'France'
        }
      },
      {
        status: 'ready',
        customerName: 'Sophie Dubois',
        customerEmail: 'sophie.dubois@example.com',
        customerPhone: '0645678901',
        deliveryType: 'pickup',
        deliveryAddress: null
      },
      {
        status: 'completed',
        customerName: 'Luc Moreau',
        customerEmail: 'luc.moreau@example.com',
        customerPhone: '0656789012',
        deliveryType: 'delivery',
        deliveryAddress: {
          street: '78 Boulevard Victor Hugo',
          city: 'Puyricard',
          postalCode: '13540',
          country: 'France'
        }
      },
      {
        status: 'cancelled',
        customerName: 'Emma Laurent',
        customerEmail: 'emma.laurent@example.com',
        customerPhone: '0667890123',
        deliveryType: 'pickup',
        deliveryAddress: null
      }
    ];

    let createdCount = 0;

    console.log('🍕 Creating test orders...');
    console.log('');

    for (let i = 0; i < testOrders.length; i++) {
      const orderData = testOrders[i];

      // Build order items (2-4 items per order)
      const itemCount = Math.floor(Math.random() * 3) + 2; // 2-4 items
      const items = [];
      let totalPrice = 0;

      for (let j = 0; j < itemCount; j++) {
        const product = j === 0 ? pizzas[Math.floor(Math.random() * pizzas.length)] :
                       j % 2 === 0 ? pizzas[Math.floor(Math.random() * pizzas.length)] :
                       boissons.length > 0 ? boissons[Math.floor(Math.random() * boissons.length)] :
                       pizzas[0];

        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
        const itemPrice = product.price * quantity;
        totalPrice += itemPrice;

        items.push({
          product: product._id,
          quantity,
          price: product.price,
          total: itemPrice
        });
      }

      // Select a time slot
      const timeSlot = availableSlots[i % availableSlots.length];

      // Create order
      const order = await Order.create({
        customerName: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        deliveryType: orderData.deliveryType,
        deliveryAddress: orderData.deliveryAddress,
        items,
        subtotal: totalPrice,
        total: totalPrice,
        status: orderData.status,
        paymentMethod: Math.random() > 0.5 ? 'card' : 'cash',
        paymentStatus: orderData.status === 'completed' ? 'paid' : 'pending',
        notes: `Test order ${i + 1}`,
        timeSlot: timeSlot._id,
        scheduledTime: timeSlot.date,
        pickupTimeRange: `${timeSlot.startTime} - ${timeSlot.endTime}`
      });

      createdCount++;
      console.log(`   ✅ Order ${order._id} - ${orderData.status} - ${orderData.customerName}`);
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ TEST ORDERS SEEDED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log(`📊 Created ${createdCount} test orders`);
    console.log('');
    console.log('📈 Order Status Distribution:');
    console.log('   • Pending: 1');
    console.log('   • Confirmed: 1');
    console.log('   • Preparing: 1');
    console.log('   • Ready: 1');
    console.log('   • Completed: 1');
    console.log('   • Cancelled: 1');
    console.log('');
    console.log('🚀 Ready for E2E testing!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ ERROR:', error);
    console.error('');
    if (error instanceof Error) {
      console.error('Message:', error.message);
      if (error.stack) {
        console.error('Stack:', error.stack);
      }
    }
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', async () => {
  console.log('\n🔄 Closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

// Run the seed function
seedTestOrders();
