/**
 * Seed Script: Generate Time Slots for Testing
 *
 * This script generates time slots for the next 3 days to enable
 * testing of the Phone Orders Dashboard.
 *
 * Run with: npm run seed:timeslots
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

async function seedTimeSlots() {
  console.log(`${colors.cyan}Starting Time Slots Generation...${colors.reset}\n`);

  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log(`${colors.green}✓ Connected to MongoDB${colors.reset}`);

    // Import timeSlots module AFTER env is loaded and connection is made
    const { generateTimeSlotsForDay } = await import('../lib/timeSlots');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysToGenerate = 3; // Today + next 2 days
    let totalGenerated = 0;

    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      console.log(
        `\n${colors.blue}Generating slots for ${date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}...${colors.reset}`
      );

      try {
        const slots = await generateTimeSlotsForDay(date);
        console.log(
          `${colors.green}✓ Generated ${slots.length} time slots${colors.reset}`
        );
        totalGenerated += slots.length;

        // Display sample slots
        if (slots.length > 0) {
          console.log(
            `  First slot: ${slots[0].startTime} - ${slots[0].endTime}`
          );
          console.log(
            `  Last slot: ${slots[slots.length - 1].startTime} - ${
              slots[slots.length - 1].endTime
            }`
          );
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exist')) {
          console.log(
            `${colors.yellow}⚠ Slots already exist for this date${colors.reset}`
          );
        } else {
          throw error;
        }
      }
    }

    // Summary
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}Generation Summary${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`Days processed: ${daysToGenerate}`);
    console.log(`${colors.green}Total slots generated: ${totalGenerated}${colors.reset}`);
    console.log(
      `\n${colors.green}✓ Time slots generation completed!${colors.reset}`
    );
    console.log(
      `\n${colors.blue}Access the dashboard at: ${colors.cyan}http://localhost:3000/admin/time-slots/dashboard${colors.reset}`
    );
  } catch (error) {
    console.error(`\n${colors.red}Generation failed:${colors.reset}`, error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run seed
seedTimeSlots();
