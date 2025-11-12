/**
 * Newsletter Validation Schema
 *
 * Validates newsletter subscription data using Zod
 */

import { z } from 'zod';

export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  name: z
    .string()
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  source: z
    .string()
    .max(50, 'Source must be less than 50 characters')
    .default('footer'),
  tags: z.array(z.string()).default([]),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
