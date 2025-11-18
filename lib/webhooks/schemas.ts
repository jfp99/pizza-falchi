/**
 * Webhook Validation Schemas
 * Zod schemas for validating webhook payloads
 */

import { z } from 'zod';
import { WebhookEventType } from '@/types/webhooks';

/**
 * Base webhook payload schema
 */
const BaseWebhookPayloadSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.nativeEnum(WebhookEventType),
  timestamp: z.string().datetime(),
  webhookVersion: z.literal('1.0'),
  metadata: z.object({
    source: z.string(),
    correlationId: z.string().uuid().optional(),
    userId: z.string().optional(),
  }).optional(),
});

/**
 * Order item schema for webhook payloads
 */
const WebhookOrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  customizations: z.string().optional(),
  totalPrice: z.number().positive(),
});

/**
 * Customer info schema
 */
const WebhookCustomerInfoSchema = z.object({
  customerId: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/), // E.164 format
  deliveryAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    instructions: z.string().optional(),
  }).optional(),
});

/**
 * Order Created Event Schema
 */
export const OrderCreatedPayloadSchema = BaseWebhookPayloadSchema.extend({
  eventType: z.literal(WebhookEventType.ORDER_CREATED),
  data: z.object({
    orderId: z.string(),
    orderNumber: z.string(),
    customer: WebhookCustomerInfoSchema,
    items: z.array(WebhookOrderItemSchema).min(1),
    subtotal: z.number().positive(),
    deliveryFee: z.number().nonnegative(),
    totalAmount: z.number().positive(),
    paymentMethod: z.enum(['card', 'cash', 'online']),
    paymentStatus: z.enum(['pending', 'paid', 'failed']),
    deliveryType: z.enum(['delivery', 'pickup']),
    scheduledFor: z.string().datetime().optional(),
    notes: z.string().optional(),
    createdAt: z.string().datetime(),
  }),
});

/**
 * Order Status Changed Event Schema
 */
export const OrderStatusChangedPayloadSchema = BaseWebhookPayloadSchema.extend({
  eventType: z.enum([
    WebhookEventType.ORDER_CONFIRMED,
    WebhookEventType.ORDER_PREPARING,
    WebhookEventType.ORDER_READY,
    WebhookEventType.ORDER_IN_DELIVERY,
    WebhookEventType.ORDER_COMPLETED,
    WebhookEventType.ORDER_CANCELLED,
  ]),
  data: z.object({
    orderId: z.string(),
    orderNumber: z.string(),
    previousStatus: z.string(),
    newStatus: z.string(),
    statusChangedAt: z.string().datetime(),
    statusChangedBy: z.string().optional(),
    estimatedReadyTime: z.string().datetime().optional(),
    estimatedDeliveryTime: z.string().datetime().optional(),
    cancellationReason: z.string().optional(),
    customer: z.object({
      name: z.string(),
      phone: z.string(),
      email: z.string().email().optional(),
    }),
  }),
});

/**
 * Driver Assignment Event Schema
 */
export const DriverAssignedPayloadSchema = BaseWebhookPayloadSchema.extend({
  eventType: z.literal(WebhookEventType.DRIVER_ASSIGNED),
  data: z.object({
    orderId: z.string(),
    orderNumber: z.string(),
    driver: z.object({
      id: z.string(),
      name: z.string().min(1),
      phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
      vehicle: z.string().optional(),
      licensePlate: z.string().optional(),
    }),
    estimatedPickupTime: z.string().datetime(),
    estimatedDeliveryTime: z.string().datetime(),
    assignedAt: z.string().datetime(),
  }),
});

/**
 * Kitchen Display System Event Schema
 */
export const KDSEventPayloadSchema = BaseWebhookPayloadSchema.extend({
  eventType: z.enum([
    WebhookEventType.KDS_ACKNOWLEDGED,
    WebhookEventType.KDS_COMPLETED,
  ]),
  data: z.object({
    orderId: z.string(),
    orderNumber: z.string(),
    kdsStatus: z.enum(['acknowledged', 'completed']),
    acknowledgedAt: z.string().datetime().optional(),
    completedAt: z.string().datetime().optional(),
    preparationTime: z.number().int().positive().optional(), // in minutes
    items: z.array(WebhookOrderItemSchema).min(1),
  }),
});

/**
 * n8n Webhook Request Schema (from n8n to our API)
 */
export const N8nWebhookRequestSchema = z.object({
  action: z.enum([
    'update_order_status',
    'assign_driver',
    'update_kds',
    'send_notification',
    'update_delivery_status',
    'cancel_order',
  ]),
  orderId: z.string(),
  data: z.object({
    // For update_order_status
    status: z.enum([
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'in_delivery',
      'completed',
      'cancelled',
    ]).optional(),
    statusReason: z.string().optional(),

    // For assign_driver
    driver: z.object({
      id: z.string(),
      name: z.string(),
      phone: z.string(),
      vehicle: z.string().optional(),
      licensePlate: z.string().optional(),
    }).optional(),
    estimatedPickupTime: z.string().datetime().optional(),
    estimatedDeliveryTime: z.string().datetime().optional(),

    // For update_kds
    kdsStatus: z.enum(['acknowledged', 'in_progress', 'completed']).optional(),
    preparationTime: z.number().optional(),

    // For send_notification
    notificationType: z.enum([
      'order_confirmation',
      'order_ready',
      'driver_assigned',
      'out_for_delivery',
      'delivered',
    ]).optional(),
    channel: z.enum(['whatsapp', 'email', 'sms']).optional(),
    message: z.string().optional(),

    // For update_delivery_status
    deliveryStatus: z.enum([
      'not_started',
      'assigned',
      'driver_en_route',
      'at_restaurant',
      'picked_up',
      'in_transit',
      'arrived',
      'delivered',
    ]).optional(),
    currentLocation: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),

    // For cancel_order
    cancellationReason: z.string().optional(),
    refundAmount: z.number().optional(),
    refundStatus: z.enum(['pending', 'processed', 'failed']).optional(),
  }),
  metadata: z.object({
    timestamp: z.string().datetime(),
    source: z.literal('n8n'),
    workflowId: z.string().optional(),
    executionId: z.string().optional(),
  }).optional(),
});

/**
 * Webhook Response Schema
 */
export const WebhookResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }).optional(),
});

/**
 * Webhook Configuration Schema
 */
export const WebhookConfigSchema = z.object({
  url: z.string().url(),
  secret: z.string().min(32),
  enabled: z.boolean(),
  events: z.array(z.nativeEnum(WebhookEventType)).min(1),
  retryAttempts: z.number().int().min(0).max(10),
  retryDelayMs: z.number().int().min(1000).max(60000),
  timeoutMs: z.number().int().min(1000).max(30000),
});

/**
 * Webhook Signature Schema
 */
export const WebhookSignatureSchema = z.object({
  signature: z.string(),
  timestamp: z.string(),
  payload: z.string(),
});

/**
 * Helper function to validate webhook payload
 */
export function validateWebhookPayload(
  eventType: WebhookEventType,
  payload: unknown
) {
  switch (eventType) {
    case WebhookEventType.ORDER_CREATED:
      return OrderCreatedPayloadSchema.safeParse(payload);

    case WebhookEventType.ORDER_CONFIRMED:
    case WebhookEventType.ORDER_PREPARING:
    case WebhookEventType.ORDER_READY:
    case WebhookEventType.ORDER_IN_DELIVERY:
    case WebhookEventType.ORDER_COMPLETED:
    case WebhookEventType.ORDER_CANCELLED:
      return OrderStatusChangedPayloadSchema.safeParse(payload);

    case WebhookEventType.DRIVER_ASSIGNED:
      return DriverAssignedPayloadSchema.safeParse(payload);

    case WebhookEventType.KDS_ACKNOWLEDGED:
    case WebhookEventType.KDS_COMPLETED:
      return KDSEventPayloadSchema.safeParse(payload);

    default:
      return {
        success: false,
        error: new z.ZodError([
          {
            code: 'custom',
            message: `Unknown event type: ${eventType}`,
            path: ['eventType'],
          },
        ]),
      };
  }
}

/**
 * Type exports from schemas
 */
export type OrderCreatedPayload = z.infer<typeof OrderCreatedPayloadSchema>;
export type OrderStatusChangedPayload = z.infer<typeof OrderStatusChangedPayloadSchema>;
export type DriverAssignedPayload = z.infer<typeof DriverAssignedPayloadSchema>;
export type KDSEventPayload = z.infer<typeof KDSEventPayloadSchema>;
export type N8nWebhookRequest = z.infer<typeof N8nWebhookRequestSchema>;
export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;
export type WebhookConfig = z.infer<typeof WebhookConfigSchema>;