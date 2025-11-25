/**
 * Query Parameter Validation Schemas
 *
 * SECURITY: Validates and sanitizes all query parameters to prevent injection attacks
 */

import { z } from 'zod';

/**
 * MongoDB ObjectId validation
 */
export const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId');

/**
 * Date string validation (YYYY-MM-DD format)
 */
export const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Expected YYYY-MM-DD');

/**
 * Order status enum
 */
export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled'
]);

/**
 * Time slot status enum
 */
export const timeSlotStatusSchema = z.enum(['active', 'full', 'closed']);

/**
 * Delivery type enum
 */
export const deliveryTypeSchema = z.enum(['pickup', 'delivery']);

/**
 * Product category enum
 */
export const productCategorySchema = z.enum(['pizza', 'boisson', 'dessert', 'accompagnement']);

/**
 * Query parameters for /api/orders
 */
export const ordersQuerySchema = z.object({
  status: orderStatusSchema.optional(),
  timeSlot: mongoIdSchema.optional(),
  date: dateStringSchema.optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
}).strict();

/**
 * Query parameters for /api/time-slots
 */
export const timeSlotsQuerySchema = z.object({
  date: dateStringSchema.optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  status: timeSlotStatusSchema.optional(),
  onlyAvailable: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  pizzaCount: z.coerce.number().int().positive().max(10).optional(),
}).strict();

/**
 * Query parameters for /api/products
 */
export const productsQuerySchema = z.object({
  category: productCategorySchema.optional(),
  available: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
}).strict();

/**
 * Helper function to validate and parse query parameters
 * Returns validated params or throws with user-friendly error
 */
export function validateQueryParams<T extends z.ZodSchema>(
  schema: T,
  searchParams: URLSearchParams
): z.infer<T> {
  // Convert URLSearchParams to plain object
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Access the issues property which contains validation errors
      const issues = (error as z.ZodError).issues;
      if (issues && issues.length > 0) {
        const firstIssue = issues[0];
        throw new Error(`Invalid query parameter '${firstIssue.path.join('.')}': ${firstIssue.message}`);
      }
      throw new Error('Invalid query parameters');
    }
    throw error;
  }
}
