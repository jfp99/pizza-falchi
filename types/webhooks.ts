/**
 * Webhook Types for n8n Integration
 * Defines all webhook event types, payloads, and responses
 */

import { z } from 'zod';

/**
 * Webhook Event Types
 */
export enum WebhookEventType {
  // Order lifecycle events
  ORDER_CREATED = 'order.created',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_PREPARING = 'order.preparing',
  ORDER_READY = 'order.ready',
  ORDER_IN_DELIVERY = 'order.in_delivery',
  ORDER_COMPLETED = 'order.completed',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_REMINDER = 'order.reminder',

  // Payment events
  PAYMENT_RECEIVED = 'payment.received',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',

  // Customer events
  CUSTOMER_REGISTERED = 'customer.registered',
  CUSTOMER_UPDATED = 'customer.updated',

  // Kitchen events
  KDS_ACKNOWLEDGED = 'kds.acknowledged',
  KDS_COMPLETED = 'kds.completed',

  // Delivery events
  DRIVER_ASSIGNED = 'delivery.driver_assigned',
  DRIVER_DEPARTED = 'delivery.driver_departed',
  DRIVER_ARRIVED = 'delivery.driver_arrived',

  // System/Health events (for n8n monitoring)
  DATABASE_HEALTH_CHECK = 'database.health_check',
  DATABASE_HEALTH_WARNING = 'database.health_warning',
  DATABASE_HEALTH_CRITICAL = 'database.health_critical',

  // Scheduled events (triggered by n8n)
  DAILY_SUMMARY = 'scheduled.daily_summary',
  WEEKLY_REPORT = 'scheduled.weekly_report',
  LOW_INVENTORY_ALERT = 'scheduled.low_inventory',
  TIMESLOT_CAPACITY_WARNING = 'scheduled.timeslot_capacity',

  // Marketing events
  ABANDONED_CART = 'marketing.abandoned_cart',
  LOYALTY_MILESTONE = 'marketing.loyalty_milestone',
  BIRTHDAY_REMINDER = 'marketing.birthday_reminder',
}

/**
 * Webhook Delivery Status
 */
export enum WebhookDeliveryStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  RETRYING = 'retrying',
}

/**
 * Base webhook payload structure
 */
export interface BaseWebhookPayload {
  eventId: string;
  eventType: WebhookEventType;
  timestamp: Date;
  webhookVersion: '1.0';
  metadata?: {
    source: string;
    correlationId?: string;
    userId?: string;
  };
}

/**
 * Order item in webhook payload
 */
export interface WebhookOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  customizations?: string;
  totalPrice: number;
}

/**
 * Customer info in webhook payload
 */
export interface WebhookCustomerInfo {
  customerId?: string;
  name: string;
  email?: string;
  phone: string;
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    instructions?: string;
  };
}

/**
 * Order Created Event Payload
 */
export interface OrderCreatedPayload extends BaseWebhookPayload {
  eventType: WebhookEventType.ORDER_CREATED;
  data: {
    orderId: string;
    orderNumber: string;
    customer: WebhookCustomerInfo;
    items: WebhookOrderItem[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    paymentMethod: 'card' | 'cash' | 'online';
    paymentStatus: 'pending' | 'paid' | 'failed';
    deliveryType: 'delivery' | 'pickup';
    scheduledFor?: Date;
    notes?: string;
    createdAt: Date;
  };
}

/**
 * Order Status Changed Event Payload
 */
export interface OrderStatusChangedPayload extends BaseWebhookPayload {
  eventType: WebhookEventType.ORDER_CONFIRMED | WebhookEventType.ORDER_PREPARING |
            WebhookEventType.ORDER_READY | WebhookEventType.ORDER_IN_DELIVERY |
            WebhookEventType.ORDER_COMPLETED | WebhookEventType.ORDER_CANCELLED;
  data: {
    orderId: string;
    orderNumber: string;
    previousStatus: string;
    newStatus: string;
    statusChangedAt: Date;
    statusChangedBy?: string;
    estimatedReadyTime?: Date;
    estimatedDeliveryTime?: Date;
    cancellationReason?: string;
    customer: {
      name: string;
      phone: string;
      email?: string;
    };
  };
}

/**
 * Driver Assignment Event Payload
 */
export interface DriverAssignedPayload extends BaseWebhookPayload {
  eventType: WebhookEventType.DRIVER_ASSIGNED;
  data: {
    orderId: string;
    orderNumber: string;
    driver: {
      id: string;
      name: string;
      phone: string;
      vehicle?: string;
      licensePlate?: string;
    };
    estimatedPickupTime: Date;
    estimatedDeliveryTime: Date;
    assignedAt: Date;
  };
}

/**
 * Kitchen Display System Event Payload
 */
export interface KDSEventPayload extends BaseWebhookPayload {
  eventType: WebhookEventType.KDS_ACKNOWLEDGED | WebhookEventType.KDS_COMPLETED;
  data: {
    orderId: string;
    orderNumber: string;
    kdsStatus: 'acknowledged' | 'completed';
    acknowledgedAt?: Date;
    completedAt?: Date;
    preparationTime?: number; // in minutes
    items: WebhookOrderItem[];
  };
}

/**
 * Database Health Check Event Payload
 */
export interface DatabaseHealthPayload extends BaseWebhookPayload {
  eventType: WebhookEventType.DATABASE_HEALTH_CHECK | WebhookEventType.DATABASE_HEALTH_WARNING | WebhookEventType.DATABASE_HEALTH_CRITICAL;
  data: {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    products: {
      count: number;
      availableCount: number;
      missingImages: string[];
    };
    timeSlots: {
      futureSlots: number;
      availableSlots: number;
      nearCapacitySlots: number;
    };
    orders: {
      pendingCount: number;
      inProgressCount: number;
    };
    recommendations: string[];
    checkedAt: Date;
  };
}

/**
 * Daily Summary Event Payload
 */
export interface DailySummaryPayload extends BaseWebhookPayload {
  eventType: WebhookEventType.DAILY_SUMMARY;
  data: {
    date: string;
    orders: {
      total: number;
      completed: number;
      cancelled: number;
      pending: number;
    };
    revenue: {
      total: number;
      average: number;
    };
    customers: {
      new: number;
      returning: number;
    };
    topProducts: Array<{ name: string; quantity: number }>;
  };
}

/**
 * Order Reminder Event Payload
 */
export interface OrderReminderPayload extends BaseWebhookPayload {
  eventType: WebhookEventType.ORDER_REMINDER;
  data: {
    orderId: string;
    orderNumber: string;
    customer: {
      name: string;
      phone: string;
      email?: string;
    };
    pickupTime: Date;
    reminderType: 'pickup_soon' | 'delivery_soon' | 'order_late';
    minutesUntilPickup: number;
  };
}

/**
 * Marketing Event Payload (Abandoned Cart, Loyalty, Birthday)
 */
export interface MarketingEventPayload extends BaseWebhookPayload {
  eventType: WebhookEventType.ABANDONED_CART | WebhookEventType.LOYALTY_MILESTONE | WebhookEventType.BIRTHDAY_REMINDER;
  data: {
    customerId?: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    eventDetails: Record<string, any>;
  };
}

/**
 * Union type for all webhook payloads
 */
export type WebhookPayload =
  | OrderCreatedPayload
  | OrderStatusChangedPayload
  | DriverAssignedPayload
  | KDSEventPayload
  | DatabaseHealthPayload
  | DailySummaryPayload
  | OrderReminderPayload
  | MarketingEventPayload;

/**
 * Webhook request from n8n to our API
 */
export interface N8nWebhookRequest {
  headers: {
    'x-webhook-signature': string;
    'x-webhook-timestamp': string;
    'x-webhook-event': string;
  };
  body: {
    action: 'update_order_status' | 'assign_driver' | 'update_kds' | 'send_notification';
    orderId: string;
    data: Record<string, any>;
  };
}

/**
 * Webhook response to n8n
 */
export interface WebhookResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Webhook delivery attempt record
 */
export interface WebhookDeliveryAttempt {
  attemptNumber: number;
  timestamp: Date;
  status: WebhookDeliveryStatus;
  statusCode?: number;
  response?: string;
  error?: string;
  duration: number; // in ms
}

/**
 * Webhook delivery record
 */
export interface WebhookDelivery {
  id: string;
  eventId: string;
  eventType: WebhookEventType;
  webhookUrl: string;
  payload: WebhookPayload;
  status: WebhookDeliveryStatus;
  attempts: WebhookDeliveryAttempt[];
  nextRetryAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Webhook configuration
 */
export interface WebhookConfig {
  url: string;
  secret: string;
  enabled: boolean;
  events: WebhookEventType[];
  retryAttempts: number;
  retryDelayMs: number;
  timeoutMs: number;
}

/**
 * Webhook signature verification
 */
export interface WebhookSignature {
  signature: string;
  timestamp: string;
  payload: string;
}

/**
 * Type guards for webhook payloads
 */
export const isOrderCreatedPayload = (payload: WebhookPayload): payload is OrderCreatedPayload => {
  return payload.eventType === WebhookEventType.ORDER_CREATED;
};

export const isOrderStatusChangedPayload = (payload: WebhookPayload): payload is OrderStatusChangedPayload => {
  return [
    WebhookEventType.ORDER_CONFIRMED,
    WebhookEventType.ORDER_PREPARING,
    WebhookEventType.ORDER_READY,
    WebhookEventType.ORDER_IN_DELIVERY,
    WebhookEventType.ORDER_COMPLETED,
    WebhookEventType.ORDER_CANCELLED,
  ].includes(payload.eventType);
};

export const isDriverAssignedPayload = (payload: WebhookPayload): payload is DriverAssignedPayload => {
  return payload.eventType === WebhookEventType.DRIVER_ASSIGNED;
};

export const isKDSEventPayload = (payload: WebhookPayload): payload is KDSEventPayload => {
  return [
    WebhookEventType.KDS_ACKNOWLEDGED,
    WebhookEventType.KDS_COMPLETED,
  ].includes(payload.eventType);
};