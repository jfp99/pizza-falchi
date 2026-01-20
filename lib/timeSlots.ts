/**
 * Time Slot Utilities
 * Helper functions for managing time slots and order scheduling
 */

import TimeSlot, { ITimeSlot } from '@/models/TimeSlot';
import OpeningHours, { IOpeningHours } from '@/models/OpeningHours';
import { connectDB } from '@/lib/mongodb';

/**
 * Generate time slots for a specific day
 * Creates TimeSlot documents based on opening hours configuration
 */
export async function generateTimeSlotsForDay(date: Date): Promise<ITimeSlot[]> {
  await connectDB();

  // Normalize date to midnight
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = targetDate.getDay();

  // Get opening hours for this day
  const openingHours = await OpeningHours.getByDayOfWeek(dayOfWeek);

  if (!openingHours) {
    throw new Error(`No opening hours configured for day ${dayOfWeek}`);
  }

  // Get hours for this specific date (considering exceptions)
  const hoursInfo = openingHours.getHoursForDate(targetDate);

  if (!hoursInfo.isOpen || !hoursInfo.hours) {
    // Pizzeria is closed on this day
    return [];
  }

  // Parse opening and closing times
  const openMinutes = openingHours.timeToMinutes(hoursInfo.hours.open);
  const closeMinutes = openingHours.timeToMinutes(hoursInfo.hours.close);

  // Generate slots
  const slots: ITimeSlot[] = [];
  const slotDuration = openingHours.slotDuration;
  const capacity = openingHours.ordersPerSlot;

  for (let minutes = openMinutes; minutes < closeMinutes; minutes += slotDuration) {
    const startTime = openingHours.minutesToTime(minutes);
    const endTime = openingHours.minutesToTime(minutes + slotDuration);

    // Check if slot already exists for this date/time
    const existingSlot = await TimeSlot.findOne({
      date: targetDate,
      startTime,
      endTime,
    });

    if (!existingSlot) {
      // Create new slot
      const newSlot = await TimeSlot.create({
        date: targetDate,
        startTime,
        endTime,
        capacity,
        currentOrders: 0,
        pizzaCount: 0,
        orders: [],
        isAvailable: true,
        status: 'active',
      });

      slots.push(newSlot);
    } else {
      slots.push(existingSlot);
    }
  }

  return slots;
}

/**
 * Get next available time slot from a given date/time
 * Returns null if no slots are available
 */
export async function getNextAvailableSlot(
  fromDate: Date = new Date()
): Promise<ITimeSlot | null> {
  await connectDB();

  // First, try to find an available slot in the database
  let slot = await TimeSlot.findNextAvailable(fromDate);

  if (slot) {
    return slot;
  }

  // If no slots found, generate slots for the next 7 days and try again
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Check if we have slots for this date
    const existingSlots = await TimeSlot.find({
      date: {
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingSlots.length === 0) {
      // Generate slots for this day
      try {
        await generateTimeSlotsForDay(date);
      } catch (error) {
        // Skip if pizzeria is closed or error generating slots
        continue;
      }
    }
  }

  // Try to find available slot again
  slot = await TimeSlot.findNextAvailable(fromDate);

  return slot;
}

/**
 * Check if a specific time slot is available for N pizzas
 */
export async function isSlotAvailable(
  date: Date,
  startTime: string,
  pizzaCount: number = 1
): Promise<boolean> {
  await connectDB();

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const slot = await TimeSlot.findOne({
    date: targetDate,
    startTime,
  });

  if (!slot) {
    return false;
  }

  return slot.canAcceptOrder(pizzaCount);
}

/**
 * Get all time slots for a date range
 */
export async function getSlotsByDateRange(
  startDate: Date,
  endDate: Date,
  onlyAvailable: boolean = false
): Promise<ITimeSlot[]> {
  await connectDB();

  const query: any = {
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  if (onlyAvailable) {
    query.isAvailable = true;
    query.status = 'active';
  }

  return await TimeSlot.find(query)
    .populate('orders')
    .sort({ date: 1, startTime: 1 });
}

/**
 * Get available time slots for a specific date
 * @param date Target date
 * @param pizzaCount Number of pizzas to fit in the slot (optional)
 */
export async function getAvailableSlotsForDate(
  date: Date,
  pizzaCount?: number
): Promise<ITimeSlot[]> {
  await connectDB();

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  // Check if slots exist for this date
  const existingSlots = await TimeSlot.find({
    date: {
      $gte: targetDate,
      $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
    },
  });

  // If no slots exist, generate them
  if (existingSlots.length === 0) {
    await generateTimeSlotsForDay(targetDate);
  }

  // Get available slots
  const availableSlots = await TimeSlot.findAvailableSlots(targetDate);

  // If pizzaCount is specified, filter slots by remaining capacity
  if (pizzaCount && pizzaCount > 0) {
    return availableSlots.filter((slot) => {
      const remainingCapacity = slot.capacity - slot.pizzaCount;
      return remainingCapacity >= pizzaCount;
    });
  }

  return availableSlots;
}

/**
 * Calculate estimated pickup time based on current time
 * Returns the next available slot's time range
 */
export async function calculatePickupTime(
  fromDate: Date = new Date()
): Promise<{ date: Date; startTime: string; endTime: string } | null> {
  await connectDB();

  const nextSlot = await getNextAvailableSlot(fromDate);

  if (!nextSlot) {
    return null;
  }

  return {
    date: nextSlot.date,
    startTime: nextSlot.startTime,
    endTime: nextSlot.endTime,
  };
}

/**
 * Assign an order to a specific time slot
 * Returns the updated time slot or throws error if not available
 */
export async function assignOrderToSlot(
  orderId: string,
  pizzaCount: number,
  date: Date,
  startTime: string
): Promise<ITimeSlot> {
  await connectDB();

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const slot = await TimeSlot.findOne({
    date: targetDate,
    startTime,
  });

  if (!slot) {
    throw new Error('Time slot not found');
  }

  if (!slot.canAcceptOrder(pizzaCount)) {
    throw new Error(`Time slot cannot accept ${pizzaCount} pizza(s). Current: ${slot.pizzaCount}/${slot.capacity}`);
  }

  // Add order to slot with pizza count
  await slot.addOrder(orderId as any, pizzaCount);

  return slot;
}

/**
 * Assign an order to the next available time slot
 * Returns the assigned time slot or throws error if none available
 */
export async function assignOrderToNextAvailable(
  orderId: string,
  pizzaCount: number,
  fromDate: Date = new Date()
): Promise<ITimeSlot> {
  await connectDB();

  const slot = await getNextAvailableSlot(fromDate);

  if (!slot) {
    throw new Error('No available time slots found');
  }

  if (!slot.canAcceptOrder(pizzaCount)) {
    throw new Error(`Next available slot cannot accept ${pizzaCount} pizza(s). Current: ${slot.pizzaCount}/${slot.capacity}`);
  }

  await slot.addOrder(orderId as any, pizzaCount);

  return slot;
}

/**
 * Remove an order from its time slot
 */
export async function removeOrderFromSlot(
  orderId: string,
  slotId: string,
  pizzaCount: number
): Promise<ITimeSlot> {
  await connectDB();

  const slot = await TimeSlot.findById(slotId);

  if (!slot) {
    throw new Error('Time slot not found');
  }

  await slot.removeOrder(orderId as any, pizzaCount);

  return slot;
}

/**
 * Get time slot statistics for a date range
 */
export async function getSlotStatistics(
  startDate: Date,
  endDate: Date
): Promise<{
  totalSlots: number;
  availableSlots: number;
  fullSlots: number;
  totalOrders: number;
  totalPizzas: number;
  averageOrdersPerSlot: number;
  averagePizzasPerSlot: number;
  utilizationRate: number;
}> {
  await connectDB();

  const slots = await getSlotsByDateRange(startDate, endDate);

  const totalSlots = slots.length;
  const availableSlots = slots.filter((slot) => slot.isAvailable).length;
  const fullSlots = slots.filter((slot) => slot.status === 'full').length;
  const totalOrders = slots.reduce((sum, slot) => sum + slot.currentOrders, 0);
  const totalPizzas = slots.reduce((sum, slot) => sum + slot.pizzaCount, 0);
  const totalCapacity = slots.reduce((sum, slot) => sum + slot.capacity, 0);

  return {
    totalSlots,
    availableSlots,
    fullSlots,
    totalOrders,
    totalPizzas,
    averageOrdersPerSlot: totalSlots > 0 ? totalOrders / totalSlots : 0,
    averagePizzasPerSlot: totalSlots > 0 ? totalPizzas / totalSlots : 0,
    utilizationRate: totalCapacity > 0 ? (totalPizzas / totalCapacity) * 100 : 0,
  };
}

/**
 * Bulk generate time slots for multiple days
 * Useful for initial setup or regenerating slots
 */
export async function bulkGenerateTimeSlots(
  startDate: Date,
  numberOfDays: number
): Promise<{ success: number; failed: number; total: number }> {
  await connectDB();

  let success = 0;
  let failed = 0;

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    try {
      await generateTimeSlotsForDay(date);
      success++;
    } catch (error) {
      failed++;
      console.error(`Failed to generate slots for ${date.toISOString()}:`, error);
    }
  }

  return {
    success,
    failed,
    total: numberOfDays,
  };
}

/**
 * Clean up old time slots (older than specified days)
 * Useful for database maintenance
 */
export async function cleanupOldSlots(daysToKeep: number = 30): Promise<number> {
  await connectDB();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  cutoffDate.setHours(0, 0, 0, 0);

  const result = await TimeSlot.deleteMany({
    date: { $lt: cutoffDate },
  });

  return result.deletedCount;
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(slot: ITimeSlot): string {
  const dateStr = slot.date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return `${dateStr} à ${slot.startTime} - ${slot.endTime} (${slot.remainingPizzas}/${slot.capacity} pizza${slot.remainingPizzas > 1 ? 's' : ''} disponible${slot.remainingPizzas > 1 ? 's' : ''})`;
}

/**
 * Validate if a date/time is valid for ordering
 * Checks if date is in the future and within valid ordering window
 */
export function isValidOrderTime(targetDate: Date, startTime: string): boolean {
  const now = new Date();

  // Parse target date and time
  const [hours, minutes] = startTime.split(':').map(Number);
  const targetDateTime = new Date(targetDate);
  targetDateTime.setHours(hours, minutes, 0, 0);

  // Must be in the future
  if (targetDateTime <= now) {
    return false;
  }

  // Must be within the next 7 days
  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + 7);

  if (targetDateTime > maxDate) {
    return false;
  }

  return true;
}
