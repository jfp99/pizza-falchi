import { z } from 'zod';

/**
 * Validation schema for phone order customer information
 */
export const phoneOrderCustomerSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),

  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      'Numéro de téléphone français invalide (ex: 06 12 34 56 78)'
    )
    .trim(),

  deliveryType: z.enum(['pickup', 'delivery'], {
    message: 'Type de service invalide (pickup ou delivery)',
  }),
});

/**
 * Validation schema for delivery address
 */
export const deliveryAddressSchema = z.object({
  street: z
    .string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères')
    .trim(),

  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères')
    .trim(),

  postalCode: z
    .string()
    .regex(/^\d{5}$/, 'Code postal invalide (5 chiffres requis)')
    .trim(),
});

/**
 * Combined customer info with conditional delivery address
 */
export const phoneOrderCustomerWithAddressSchema = phoneOrderCustomerSchema.and(
  z.discriminatedUnion('deliveryType', [
    z.object({
      deliveryType: z.literal('pickup'),
    }),
    z.object({
      deliveryType: z.literal('delivery'),
      address: deliveryAddressSchema,
    }),
  ])
);

/**
 * Validation schema for order items
 */
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'ID produit requis'),
  name: z.string().min(1, 'Nom du produit requis'),
  quantity: z
    .number()
    .int('La quantité doit être un nombre entier')
    .positive('La quantité doit être positive')
    .max(50, 'Quantité maximale: 50'),
  price: z
    .number()
    .positive('Le prix doit être positif')
    .max(1000, 'Prix maximum: 1000€'),
  category: z.enum(['pizza', 'boisson', 'dessert', 'accompagnement']),
});

/**
 * Validation schema for the complete phone order
 */
export const completePhoneOrderSchema = z.object({
  customer: phoneOrderCustomerWithAddressSchema,
  items: z
    .array(orderItemSchema)
    .min(1, 'Au moins un article requis')
    .max(50, 'Maximum 50 articles par commande'),
  slotId: z.string().min(1, 'Créneau horaire requis'),
  pizzaCount: z
    .number()
    .int()
    .min(0, 'Le nombre de pizzas ne peut pas être négatif')
    .max(50, 'Maximum 50 pizzas par commande'),
});

/**
 * Type exports for TypeScript
 */
export type PhoneOrderCustomer = z.infer<typeof phoneOrderCustomerSchema>;
export type DeliveryAddress = z.infer<typeof deliveryAddressSchema>;
export type PhoneOrderCustomerWithAddress = z.infer<typeof phoneOrderCustomerWithAddressSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CompletePhoneOrder = z.infer<typeof completePhoneOrderSchema>;

/**
 * Validation helper for phone numbers
 * Normalizes French phone numbers to standard format
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all spaces, dots, and dashes
  let normalized = phone.replace(/[\s.-]/g, '');

  // Convert international prefix to local
  if (normalized.startsWith('+33')) {
    normalized = '0' + normalized.substring(3);
  } else if (normalized.startsWith('0033')) {
    normalized = '0' + normalized.substring(4);
  }

  return normalized;
}

/**
 * Format phone number for display
 * Converts 0612345678 to 06 12 34 56 78
 */
export function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);

  if (normalized.length !== 10) {
    return phone; // Return as-is if invalid length
  }

  return normalized.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}
