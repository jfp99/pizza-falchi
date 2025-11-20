/**
 * Seed Opening Hours Script
 * Initializes the database with default opening hours configuration
 * Based on: "Ouvert 6j/7 • 18h-21h30"
 */

// IMPORTANT: Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

const DEFAULT_OPENING_HOURS = [
  {
    dayOfWeek: 0, // Sunday - CLOSED
    isOpen: false,
    slotDuration: 10,
    ordersPerSlot: 4, // 4 pizzas per slot (oven capacity)
    exceptions: [],
  },
  {
    dayOfWeek: 1, // Monday (Lundi) - OPEN
    isOpen: true,
    hours: {
      open: '18:00',
      close: '21:30',
    },
    slotDuration: 10,
    ordersPerSlot: 4, // 4 pizzas per slot (oven capacity)
    exceptions: [],
  },
  {
    dayOfWeek: 2, // Tuesday (Mardi) - OPEN
    isOpen: true,
    hours: {
      open: '18:00',
      close: '21:30',
    },
    slotDuration: 10,
    ordersPerSlot: 4, // 4 pizzas per slot (oven capacity)
    exceptions: [],
  },
  {
    dayOfWeek: 3, // Wednesday (Mercredi) - OPEN
    isOpen: true,
    hours: {
      open: '18:00',
      close: '21:30',
    },
    slotDuration: 10,
    ordersPerSlot: 4, // 4 pizzas per slot (oven capacity)
    exceptions: [],
  },
  {
    dayOfWeek: 4, // Thursday (Jeudi) - OPEN
    isOpen: true,
    hours: {
      open: '18:00',
      close: '21:30',
    },
    slotDuration: 10,
    ordersPerSlot: 4, // 4 pizzas per slot (oven capacity)
    exceptions: [],
  },
  {
    dayOfWeek: 5, // Friday (Vendredi) - OPEN
    isOpen: true,
    hours: {
      open: '18:00',
      close: '21:30',
    },
    slotDuration: 10,
    ordersPerSlot: 4, // 4 pizzas per slot (oven capacity)
    exceptions: [],
  },
  {
    dayOfWeek: 6, // Saturday (Samedi) - OPEN
    isOpen: true,
    hours: {
      open: '18:00',
      close: '21:30',
    },
    slotDuration: 10,
    ordersPerSlot: 4, // 4 pizzas per slot (oven capacity)
    exceptions: [],
  },
];

async function seedOpeningHours() {
  try {
    console.log('🌱 Starting opening hours seeding...');

    // Dynamic import for models (to ensure env vars are loaded first)
    const OpeningHoursModule = await import('../models/OpeningHours.js');
    const OpeningHours = OpeningHoursModule.default;

    const mongodbModule = await import('../lib/mongodb.js');
    const connectDB = mongodbModule.connectDB;

    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if opening hours already exist
    const existingCount = await OpeningHours.countDocuments();

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing opening hours records`);
      console.log('Do you want to:');
      console.log('1. Skip seeding (keep existing data)');
      console.log('2. Clear and reseed');
      console.log('\nTo clear and reseed, run: npm run seed:opening-hours -- --force');

      // Check if --force flag is present
      const forceFlag = process.argv.includes('--force');

      if (!forceFlag) {
        console.log('\n✋ Skipping seed - existing data preserved');
        process.exit(0);
      }

      console.log('\n🗑️  Clearing existing opening hours...');
      await OpeningHours.deleteMany({});
      console.log('✅ Existing data cleared');
    }

    // Insert opening hours
    console.log('\n📅 Creating opening hours configuration...');

    for (const openingHour of DEFAULT_OPENING_HOURS) {
      const created = await OpeningHours.create(openingHour);
      const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][
        openingHour.dayOfWeek
      ];
      const status = openingHour.isOpen
        ? `${openingHour.hours?.open} - ${openingHour.hours?.close}`
        : 'Fermé';
      console.log(`  ✓ ${dayName}: ${status}`);
    }

    console.log('\n✨ Opening hours seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • Total days configured: ${DEFAULT_OPENING_HOURS.length}`);
    console.log(
      `  • Open days: ${DEFAULT_OPENING_HOURS.filter((oh) => oh.isOpen).length}`
    );
    console.log(
      `  • Closed days: ${DEFAULT_OPENING_HOURS.filter((oh) => !oh.isOpen).length}`
    );
    console.log(`  • Slot duration: ${DEFAULT_OPENING_HOURS[1].slotDuration} minutes`);
    console.log(`  • Orders per slot: ${DEFAULT_OPENING_HOURS[1].ordersPerSlot}`);

    // Display operating hours
    console.log('\n🕐 Operating Hours:');
    DEFAULT_OPENING_HOURS.forEach((oh) => {
      const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][
        oh.dayOfWeek
      ];
      const status = oh.isOpen ? `${oh.hours?.open} - ${oh.hours?.close}` : '❌ Fermé';
      console.log(`  ${dayName.padEnd(10)}: ${status}`);
    });

    console.log('\n💡 Next steps:');
    console.log('  1. Generate time slots: npm run seed:time-slots');
    console.log('  2. Or use API: POST /api/time-slots');
    console.log('     Body: { "startDate": "2025-10-29", "numberOfDays": 7 }');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding opening hours:', error);
    process.exit(1);
  }
}

// Run seed function
seedOpeningHours();
