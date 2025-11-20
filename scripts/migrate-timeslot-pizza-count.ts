/**
 * Migration Script: Calculate Pizza Count for All Time Slots
 *
 * This script updates all existing TimeSlot documents to calculate
 * and store the correct pizzaCount based on their orders.
 *
 * Run with: npx tsx scripts/migrate-timeslot-pizza-count.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/mongodb';
import TimeSlot from '../models/TimeSlot';
import Order from '../models/Order';
import Product from '../models/Product';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

async function migratePizzaCount() {
  console.log(`${colors.cyan}Starting TimeSlot Pizza Count Migration...${colors.reset}\n`);

  try {
    // Connect to database
    await connectDB();
    console.log(`${colors.green}✓ Connected to MongoDB${colors.reset}`);

    // Get all time slots (without populating - we'll calculate from Order model directly)
    const slots = await TimeSlot.find({});

    console.log(`${colors.blue}Found ${slots.length} time slots to process${colors.reset}\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const slot of slots) {
      try {
        const oldPizzaCount = slot.pizzaCount || 0;

        // Calculate pizza count from orders using Order model directly
        let calculatedPizzaCount = 0;

        for (const orderId of slot.orders) {
          try {
            const order = await Order.findById(orderId).populate('items.product');
            if (!order) {
              console.log(`${colors.yellow}⚠ Order ${orderId} not found in slot ${slot._id}${colors.reset}`);
              continue;
            }

            // Count pizzas in this order
            const orderPizzaCount = order.items
              ?.filter((item: any) => item.product?.category === 'pizza')
              .reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;

            calculatedPizzaCount += orderPizzaCount;
          } catch (orderError) {
            console.log(`${colors.yellow}⚠ Error loading order ${orderId}: ${orderError}${colors.reset}`);
          }
        }

        // Update slot if pizza count changed
        if (calculatedPizzaCount !== oldPizzaCount) {
          slot.pizzaCount = calculatedPizzaCount;
          await slot.save();

          console.log(
            `${colors.green}✓${colors.reset} Slot ${colors.cyan}${slot.timeRange}${colors.reset} (${new Date(slot.date).toLocaleDateString('fr-FR')}): ` +
            `${oldPizzaCount} → ${calculatedPizzaCount} pizzas (${slot.currentOrders} orders)`
          );

          updated++;
        } else {
          console.log(
            `${colors.blue}→${colors.reset} Slot ${slot.timeRange} (${new Date(slot.date).toLocaleDateString('fr-FR')}): ` +
            `Already correct (${calculatedPizzaCount} pizzas)`
          );
          skipped++;
        }
      } catch (error) {
        console.error(
          `${colors.red}✗ Error processing slot ${slot._id}:${colors.reset}`,
          error instanceof Error ? error.message : error
        );
        errors++;
      }
    }

    // Summary
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}Migration Summary${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`Total slots processed: ${slots.length}`);
    console.log(`${colors.green}Updated: ${updated}${colors.reset}`);
    console.log(`${colors.blue}Skipped (already correct): ${skipped}${colors.reset}`);
    if (errors > 0) {
      console.log(`${colors.red}Errors: ${errors}${colors.reset}`);
    }
    console.log(`\n${colors.green}✓ Migration completed successfully!${colors.reset}`);

  } catch (error) {
    console.error(`\n${colors.red}Migration failed:${colors.reset}`, error);
    process.exit(1);
  } finally {
    // Close database connection
    process.exit(0);
  }
}

// Run migration
migratePizzaCount();
