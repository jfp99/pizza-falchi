import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

// Common extras for pizzas
const commonExtras = [
  { name: 'mozzarella', price: 1 },
  { name: 'chèvre', price: 1 },
  { name: 'chorizo', price: 1 },
  { name: 'figatelli', price: 1 },
  { name: 'emmental', price: 1 },
  { name: 'thon', price: 1 },
  { name: 'anchois', price: 1 },
  { name: 'câpres', price: 1 },
];

// Size options for all pizzas
const sizeOptions = {
  medium: {
    available: true,
    priceModifier: 0
  },
  large: {
    available: true,
    priceModifier: 1.5
  }
};

async function updatePizzaOptions() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Update all pizza products with size options and extras
    const result = await Product.updateMany(
      { category: 'pizza' },
      {
        $set: {
          sizeOptions: sizeOptions,
          availableExtras: commonExtras
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} pizza products with size options and extras`);

    // Verify the update
    const samplePizza = await Product.findOne({ category: 'pizza' });
    if (samplePizza) {
      console.log('\n📋 Sample pizza after update:');
      console.log('Name:', samplePizza.name);
      console.log('Size Options:', JSON.stringify(samplePizza.sizeOptions, null, 2));
      console.log('Available Extras:', samplePizza.availableExtras?.length || 0, 'extras');
    }

    await mongoose.disconnect();
    console.log('\n✅ Database connection closed');
    console.log('🎉 Pizza options updated successfully!');

  } catch (error) {
    console.error('❌ Error updating pizza options:', error);
    process.exit(1);
  }
}

updatePizzaOptions();
