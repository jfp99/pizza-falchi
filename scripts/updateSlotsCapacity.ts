/**
 * Update Script: Change Time Slots Capacity from 2 to 4
 *
 * This script updates all existing TimeSlot documents to use the new
 * oven capacity of 4 pizzas per slot.
 *
 * Run with: npx tsx scripts/updateSlotsCapacity.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load environment variables from .env.local BEFORE importing anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function updateSlotsCapacity() {
  console.log(`${colors.cyan}Starting Time Slots Capacity Update...${colors.reset}\n`);

  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log(`${colors.green}✓ Connected to MongoDB${colors.reset}`);

    // Import TimeSlot model AFTER env is loaded and connection is made
    const TimeSlotModule = await import('../models/TimeSlot');
    const TimeSlot = TimeSlotModule.default;

    // Get all time slots
    const slots = await TimeSlot.find({});
    console.log(`${colors.blue}Found ${slots.length} time slots to check${colors.reset}\n`);

    let updated = 0;
    let alreadyCorrect = 0;

    for (const slot of slots) {
      if (slot.capacity === 2) {
        // Update capacity to 4
        slot.capacity = 4;
        await slot.save();

        console.log(
          `${colors.green}✓${colors.reset} Updated slot ${colors.cyan}${slot.timeRange}${colors.reset} ` +
          `(${new Date(slot.date).toLocaleDateString('fr-FR')}): capacity 2 → 4`
        );

        updated++;
      } else if (slot.capacity === 4) {
        alreadyCorrect++;
      } else {
        console.log(
          `${colors.yellow}⚠${colors.reset} Slot ${slot.timeRange} has unusual capacity: ${slot.capacity}`
        );
      }
    }

    // Summary
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}Update Summary${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`Total slots processed: ${slots.length}`);
    console.log(`${colors.green}Updated to capacity 4: ${updated}${colors.reset}`);
    console.log(`${colors.blue}Already capacity 4: ${alreadyCorrect}${colors.reset}`);
    console.log(`\n${colors.green}✓ Capacity update completed!${colors.reset}`);

    if (updated > 0) {
      console.log(
        `\n${colors.yellow}⚠ Note: Existing orders may still be counted against the old capacity.${colors.reset}`
      );
      console.log(
        `${colors.yellow}  Consider running: npm run migrate:timeslot-pizza${colors.reset}`
      );
    }

  } catch (error) {
    console.error(`\n${colors.red}Update failed:${colors.reset}`, error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run update
updateSlotsCapacity();
