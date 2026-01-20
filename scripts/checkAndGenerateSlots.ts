/**
 * Script to check and generate time slots for today
 * Run with: npx tsx scripts/checkAndGenerateSlots.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { connectDB } from '../lib/mongodb';
import TimeSlot from '../models/TimeSlot';
import { generateTimeSlotsForDay } from '../lib/timeSlots';

async function checkAndGenerateSlots() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('📅 Checking time slots for:', today.toISOString().split('T')[0]);
    console.log('');

    // Check existing slots
    const existingSlots = await TimeSlot.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    }).sort({ startTime: 1 });

    console.log(`Found ${existingSlots.length} existing slots`);
    console.log('');

    if (existingSlots.length === 0) {
      console.log('🔧 Generating time slots for today...');
      const slots = await generateTimeSlotsForDay(today);
      console.log(`✅ Created ${slots.length} time slots`);
      console.log('');
    }

    // Display all slots with their capacity
    const allSlots = await TimeSlot.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    }).sort({ startTime: 1 });

    console.log('📊 Time Slots Summary:');
    console.log('━'.repeat(60));

    for (const slot of allSlots) {
      const remaining = slot.capacity - slot.pizzaCount;
      const status = slot.isAvailable ? '✅' : '❌';
      const occupancy = `${slot.pizzaCount}/${slot.capacity}`;

      console.log(
        `${status} ${slot.startTime} - ${slot.endTime} | ` +
        `Pizzas: ${occupancy} | ` +
        `Remaining: ${remaining} | ` +
        `Orders: ${slot.currentOrders} | ` +
        `Status: ${slot.status}`
      );
    }
    console.log('━'.repeat(60));
    console.log('');

    // Check for slots that can accept 3 pizzas
    const slotsFor3Pizzas = allSlots.filter(slot => {
      const remaining = slot.capacity - slot.pizzaCount;
      return remaining >= 3 && slot.isAvailable && slot.status === 'active';
    });

    console.log(`🍕 Slots that can accept 3 pizzas: ${slotsFor3Pizzas.length}`);
    if (slotsFor3Pizzas.length > 0) {
      slotsFor3Pizzas.forEach(slot => {
        console.log(`  ✓ ${slot.startTime} - ${slot.endTime} (${slot.capacity - slot.pizzaCount} places)`);
      });
    } else {
      console.log('  ⚠️  No slots available for 3 pizzas');
      console.log('  💡 This might be because:');
      console.log('     - All slots are full');
      console.log('     - No slots exist for today');
      console.log('     - Opening hours not configured for this day');
    }
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndGenerateSlots();
