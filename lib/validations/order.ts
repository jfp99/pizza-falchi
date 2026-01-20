import { z } from 'zod';

/**
 * Validation schema for delivery address
 */
export const deliveryAddressSchema = z.object({
  street: z
    .string()
    .min(5, 'Adresse trop courte (minimum 5 caractères)')
    .max(200, 'Adresse trop longue (maximum 200 caractères)')
    .trim(),
  city: z
    .string()
    .min(2, 'Ville requise (minimum 2 caractères)')
    .max(100, 'Nom de ville trop long')
    .trim(),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, 'Code postal invalide (format: 12345)')
    .trim(),
  country: z
    .string()
    .max(100, 'Nom de pays trop long')
    .optional(),
  additionalInfo: z
    .string()
    .max(500, 'Informations additionnelles trop longues')
    .optional(),
});

/**
 * Validation schema for pizza customizations
 */
export const customizationsSchema = z.object({
  size: z.enum(['medium', 'large']).optional(),
  extras: z.array(z.string().max(100)).max(20).optional(),
  cut: z.boolean().optional(),
  notes: z.string().max(500).optional(),
}).optional();

/**
 * Validation schema for order item
 */
export const orderItemSchema = z.object({
  product: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'ID produit invalide')
    .trim(),
  quantity: z
    .number()
    .int('La quantité doit être un nombre entier')
    .min(1, 'Quantité minimum: 1')
    .max(50, 'Quantité maximum: 50'),
  price: z
    .number()
    .positive('Le prix doit être positif')
    .max(1000, 'Prix maximum dépassé'),
  total: z
    .number()
    .positive('Le total doit être positif')
    .max(50000, 'Total maximum dépassé'),
  customizations: customizationsSchema,
});

/**
 * Validation schema for complete order
 */
export const orderSchema = z
  .object({
    customerName: z
      .string()
      .min(2, 'Nom trop court (minimum 2 caractères)')
      .max(100, 'Nom trop long (maximum 100 caractères)')
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'
      )
      .trim(),
    email: z
      .string()
      .email('Format d\'email invalide')
      .max(255, 'Email trop long')
      .optional()
      .or(z.literal('')),
    phone: z
      .string()
      .min(10, 'Numéro de téléphone trop court (minimum 10 chiffres)')
      .max(20, 'Numéro de téléphone trop long')
      .regex(
        /^[+]?[\d\s.-]{10,20}$/,
        'Format de téléphone invalide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78)'
      )
      .trim(),
    deliveryType: z.enum(['delivery', 'pickup']),
    deliveryAddress: deliveryAddressSchema.optional(),
    items: z
      .array(orderItemSchema)
      .min(1, 'Le panier doit contenir au moins un article')
      .max(20, 'Maximum 20 articles par commande'),
    subtotal: z
      .number()
      .nonnegative('Le sous-total doit être positif ou nul')
      .max(10000, 'Montant maximum dépassé'),
    tax: z
      .number()
      .nonnegative('La taxe doit être positive ou nulle')
      .max(2000, 'Montant de taxe trop élevé'),
    deliveryFee: z
      .number()
      .nonnegative('Les frais de livraison doivent être positifs ou nuls')
      .max(100, 'Frais de livraison maximum dépassés'),
    total: z
      .number()
      .positive('Le total doit être positif')
      .max(10000, 'Montant total maximum dépassé'),
    paymentMethod: z.enum(['card', 'cash', 'online']),
    notes: z
      .string()
      .max(500, 'Notes trop longues (maximum 500 caractères)')
      .optional()
      .or(z.literal('')),
    // Time slot management fields (optional)
    timeSlot: z
      .string()
      .regex(/^[a-f\d]{24}$/i, 'ID de créneau horaire invalide')
      .optional(),
    scheduledTime: z.coerce.date().optional(),
    pickupTimeRange: z
      .string()
      .max(50, 'Plage horaire trop longue')
      .optional(),
    assignedBy: z.enum(['customer', 'cashier', 'system']).optional(),
    isManualAssignment: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If delivery type is delivery, deliveryAddress must be provided
      if (data.deliveryType === 'delivery') {
        return !!data.deliveryAddress;
      }
      return true;
    },
    {
      message: 'Adresse de livraison requise pour les livraisons à domicile',
      path: ['deliveryAddress'],
    }
  )
  .refine(
    (data) => {
      // Validate that total matches subtotal + tax + deliveryFee
      const calculatedTotal = data.subtotal + data.tax + data.deliveryFee;
      const difference = Math.abs(calculatedTotal - data.total);
      return difference < 0.01; // Allow for floating point rounding
    },
    {
      message: 'Le total ne correspond pas à la somme sous-total + taxe + frais de livraison',
      path: ['total'],
    }
  );

/**
 * Type inference from Zod schema
 */
export type OrderValidation = z.infer<typeof orderSchema>;
export type OrderItemValidation = z.infer<typeof orderItemSchema>;
export type DeliveryAddressValidation = z.infer<typeof deliveryAddressSchema>;
