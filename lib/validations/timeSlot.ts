/**
 * Zod Validation Schemas for Time Slots and Opening Hours
 */

import { z } from 'zod';

/**
 * Time format validation (HH:MM)
 */
const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const timeSchema = z
  .string()
  .regex(timeFormatRegex, 'Invalid time format (use HH:MM)');

/**
 * Time Range Schema
 */
export const timeRangeSchema = z.object({
  open: timeSchema,
  close: timeSchema,
});

/**
 * Exception Schema
 */
export const exceptionSchema = z.object({
  date: z.coerce.date(),
  isClosed: z.boolean(),
  reason: z.string().max(200).optional(),
  customHours: timeRangeSchema.optional(),
});

/**
 * TimeSlot Schema
 */
export const timeSlotSchema = z.object({
  date: z.coerce.date(),
  startTime: timeSchema,
  endTime: timeSchema,
  capacity: z.number().int().min(1).max(10).default(4), // 4 pizzas per slot (oven capacity)
  currentOrders: z.number().int().min(0).default(0),
  orders: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
  status: z.enum(['active', 'full', 'closed']).default('active'),
});

/**
 * TimeSlot Creation Schema (for API requests)
 */
export const createTimeSlotSchema = z.object({
  date: z.coerce.date(),
  startTime: timeSchema,
  endTime: timeSchema,
  capacity: z.number().int().min(1).max(10).optional().default(4), // 4 pizzas per slot (oven capacity)
});

/**
 * TimeSlot Update Schema (for API requests)
 */
export const updateTimeSlotSchema = z.object({
  action: z.enum(['addOrder', 'removeOrder', 'updateStatus']),
  orderId: z.string().optional(),
  status: z.enum(['active', 'full', 'closed']).optional(),
});

/**
 * OpeningHours Schema
 */
export const openingHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  isOpen: z.boolean(),
  hours: timeRangeSchema.optional(),
  exceptions: z.array(exceptionSchema).default([]),
  slotDuration: z.number().int().min(5).max(60).default(10),
  ordersPerSlot: z.number().int().min(1).max(10).default(4), // 4 pizzas per slot (oven capacity)
});

/**
 * OpeningHours Creation/Update Schema (for API requests)
 */
export const createOpeningHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  isOpen: z.boolean(),
  hours: timeRangeSchema.optional(),
  slotDuration: z.number().int().min(5).max(60).optional().default(10),
  ordersPerSlot: z.number().int().min(1).max(10).optional().default(4), // 4 pizzas per slot (oven capacity)
});

/**
 * Exception Creation Schema (for API requests)
 */
export const createExceptionSchema = z.object({
  date: z.coerce.date(),
  isClosed: z.boolean(),
  reason: z.string().max(200).optional(),
  customHours: timeRangeSchema.optional(),
});

/**
 * Time Slot Query Schema (for GET requests)
 */
export const timeSlotQuerySchema = z.object({
  date: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  onlyAvailable: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

/**
 * Generate Time Slots Schema (for POST requests)
 */
export const generateTimeSlotsSchema = z.object({
  startDate: z.coerce.date(),
  numberOfDays: z.number().int().min(1).max(30).default(7),
});

/**
 * Assign Order to Slot Schema
 */
export const assignOrderSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  date: z.coerce.date(),
  startTime: timeSchema,
});

/**
 * Assign Order to Next Available Schema
 */
export const assignOrderToNextAvailableSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  fromDate: z.coerce.date().optional(),
});

/**
 * Type exports for use in components and API routes
 */
export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type CreateTimeSlot = z.infer<typeof createTimeSlotSchema>;
export type UpdateTimeSlot = z.infer<typeof updateTimeSlotSchema>;
export type OpeningHours = z.infer<typeof openingHoursSchema>;
export type CreateOpeningHours = z.infer<typeof createOpeningHoursSchema>;
export type Exception = z.infer<typeof exceptionSchema>;
export type CreateException = z.infer<typeof createExceptionSchema>;
export type TimeSlotQuery = z.infer<typeof timeSlotQuerySchema>;
export type GenerateTimeSlots = z.infer<typeof generateTimeSlotsSchema>;
export type AssignOrder = z.infer<typeof assignOrderSchema>;
export type AssignOrderToNextAvailable = z.infer<typeof assignOrderToNextAvailableSchema>;
