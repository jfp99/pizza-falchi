import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

async function makeAllProductsAvailable() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!');
    console.log('');

    // Count unavailable products before update
    const unavailableCount = await Product.countDocuments({ available: false });
    console.log(`📊 Found ${unavailableCount} unavailable products`);

    if (unavailableCount === 0) {
      console.log('✅ All products are already available!');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Update all products to available: true
    const result = await Product.updateMany(
      { available: false },
      { $set: { available: true } }
    );

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ UPDATE SUCCESSFUL!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log(`📦 Updated ${result.modifiedCount} products to available: true`);
    console.log('');

    // Verify all products are now available
    const stillUnavailable = await Product.countDocuments({ available: false });
    if (stillUnavailable === 0) {
      console.log('✅ Verification: All products are now available!');
    } else {
      console.log(`⚠️  Warning: ${stillUnavailable} products are still unavailable`);
    }

    console.log('');
    await mongoose.disconnect();
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

// Run the update function
makeAllProductsAvailable();
