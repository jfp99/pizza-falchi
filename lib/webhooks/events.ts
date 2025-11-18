/**
 * Webhook Event System
 * Event emitter and management for order status changes
 */

import { EventEmitter } from 'events';
import { WebhookEventType, WebhookPayload } from '@/types/webhooks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Order event data structure
 */
export interface OrderEventData {
  orderId: string;
  orderNumber: string;
  previousStatus?: string;
  newStatus?: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
    deliveryAddress?: {
      street: string;
      city: string;
      postalCode: string;
      instructions?: string;
    };
  };
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    customizations?: string;
    totalPrice: number;
  }>;
  totalAmount?: number;
  deliveryType?: 'delivery' | 'pickup';
  paymentMethod?: 'card' | 'cash' | 'online';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  metadata?: Record<string, any>;
}

/**
 * Event listener callback
 */
type EventListener = (event: WebhookPayload) => void | Promise<void>;

/**
 * Webhook Event Emitter
 */
class WebhookEventEmitter extends EventEmitter {
  private webhookListeners: Map<WebhookEventType, Set<EventListener>> = new Map();
  private eventHistory: WebhookPayload[] = [];
  private maxHistorySize = 100;

  constructor() {
    super();
    this.setMaxListeners(50); // Increase max listeners
  }

  /**
   * Emit order created event
   */
  async emitOrderCreated(data: OrderEventData): Promise<void> {
    const event: WebhookPayload = {
      eventId: uuidv4(),
      eventType: WebhookEventType.ORDER_CREATED,
      timestamp: new Date(),
      webhookVersion: '1.0',
      metadata: {
        source: 'pizza-falchi-api',
        correlationId: uuidv4(),
        ...data.metadata,
      },
      data: {
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        customer: data.customer,
        items: data.items || [],
        subtotal: data.totalAmount || 0,
        deliveryFee: 0, // Will be calculated based on delivery type
        totalAmount: data.totalAmount || 0,
        paymentMethod: data.paymentMethod || 'cash',
        paymentStatus: data.paymentStatus || 'pending',
        deliveryType: data.deliveryType || 'pickup',
        notes: data.metadata?.notes,
        createdAt: new Date(),
      },
    } as any;

    await this.emitWebhookEvent(event);
  }

  /**
   * Emit order status changed event
   */
  async emitOrderStatusChanged(
    eventType: WebhookEventType,
    data: OrderEventData
  ): Promise<void> {
    const event: WebhookPayload = {
      eventId: uuidv4(),
      eventType,
      timestamp: new Date(),
      webhookVersion: '1.0',
      metadata: {
        source: 'pizza-falchi-api',
        correlationId: uuidv4(),
        ...data.metadata,
      },
      data: {
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        previousStatus: data.previousStatus || '',
        newStatus: data.newStatus || '',
        statusChangedAt: new Date(),
        statusChangedBy: data.metadata?.userId,
        customer: {
          name: data.customer.name,
          phone: data.customer.phone,
          email: data.customer.email,
        },
      },
    } as any;

    await this.emitWebhookEvent(event);
  }

  /**
   * Emit driver assigned event
   */
  async emitDriverAssigned(
    orderId: string,
    orderNumber: string,
    driver: {
      id: string;
      name: string;
      phone: string;
      vehicle?: string;
      licensePlate?: string;
    },
    estimatedTimes: {
      pickup: Date;
      delivery: Date;
    }
  ): Promise<void> {
    const event: WebhookPayload = {
      eventId: uuidv4(),
      eventType: WebhookEventType.DRIVER_ASSIGNED,
      timestamp: new Date(),
      webhookVersion: '1.0',
      metadata: {
        source: 'pizza-falchi-api',
        correlationId: uuidv4(),
      },
      data: {
        orderId,
        orderNumber,
        driver,
        estimatedPickupTime: estimatedTimes.pickup,
        estimatedDeliveryTime: estimatedTimes.delivery,
        assignedAt: new Date(),
      },
    } as any;

    await this.emitWebhookEvent(event);
  }

  /**
   * Emit KDS event
   */
  async emitKDSEvent(
    eventType: WebhookEventType.KDS_ACKNOWLEDGED | WebhookEventType.KDS_COMPLETED,
    orderId: string,
    orderNumber: string,
    items: OrderEventData['items'],
    preparationTime?: number
  ): Promise<void> {
    const now = new Date();
    const event: WebhookPayload = {
      eventId: uuidv4(),
      eventType,
      timestamp: now,
      webhookVersion: '1.0',
      metadata: {
        source: 'pizza-falchi-api',
        correlationId: uuidv4(),
      },
      data: {
        orderId,
        orderNumber,
        kdsStatus: eventType === WebhookEventType.KDS_ACKNOWLEDGED ? 'acknowledged' : 'completed',
        acknowledgedAt: eventType === WebhookEventType.KDS_ACKNOWLEDGED ? now : undefined,
        completedAt: eventType === WebhookEventType.KDS_COMPLETED ? now : undefined,
        preparationTime,
        items: items || [],
      },
    } as any;

    await this.emitWebhookEvent(event);
  }

  /**
   * Register webhook listener
   */
  onWebhook(eventType: WebhookEventType, listener: EventListener): void {
    if (!this.webhookListeners.has(eventType)) {
      this.webhookListeners.set(eventType, new Set());
    }
    this.webhookListeners.get(eventType)!.add(listener);

    // Also register with Node's EventEmitter for compatibility
    this.on(eventType, listener);
  }

  /**
   * Remove webhook listener
   */
  offWebhook(eventType: WebhookEventType, listener: EventListener): void {
    const listeners = this.webhookListeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
    this.off(eventType, listener);
  }

  /**
   * Emit webhook event
   */
  private async emitWebhookEvent(event: WebhookPayload): Promise<void> {
    // Add to history
    this.addToHistory(event);

    // Emit to all listeners
    const listeners = this.webhookListeners.get(event.eventType);
    if (listeners) {
      const promises: Promise<void>[] = [];

      for (const listener of listeners) {
        try {
          const result = listener(event);
          if (result instanceof Promise) {
            promises.push(result);
          }
        } catch (error) {
          console.error(`Error in webhook listener for ${event.eventType}:`, error);
        }
      }

      // Wait for all async listeners
      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }
    }

    // Also emit using Node's EventEmitter
    this.emit(event.eventType, event);
    this.emit('webhook', event); // Generic webhook event
  }

  /**
   * Add event to history
   */
  private addToHistory(event: WebhookPayload): void {
    this.eventHistory.push(event);

    // Trim history if needed
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get event history
   */
  getHistory(eventType?: WebhookEventType, limit?: number): WebhookPayload[] {
    let history = [...this.eventHistory];

    if (eventType) {
      history = history.filter(e => e.eventType === eventType);
    }

    if (limit) {
      history = history.slice(-limit);
    }

    return history;
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get registered event types
   */
  getRegisteredEventTypes(): WebhookEventType[] {
    return Array.from(this.webhookListeners.keys());
  }

  /**
   * Get listener count for event type
   */
  getListenerCount(eventType: WebhookEventType): number {
    const listeners = this.webhookListeners.get(eventType);
    return listeners ? listeners.size : 0;
  }
}

// Create singleton instance
export const webhookEvents = new WebhookEventEmitter();

/**
 * Helper function to map order status to webhook event type
 */
export function getEventTypeForOrderStatus(status: string): WebhookEventType | null {
  const statusMap: Record<string, WebhookEventType> = {
    'confirmed': WebhookEventType.ORDER_CONFIRMED,
    'preparing': WebhookEventType.ORDER_PREPARING,
    'ready': WebhookEventType.ORDER_READY,
    'in_delivery': WebhookEventType.ORDER_IN_DELIVERY,
    'completed': WebhookEventType.ORDER_COMPLETED,
    'cancelled': WebhookEventType.ORDER_CANCELLED,
  };

  return statusMap[status] || null;
}

/**
 * Helper to create order event data from order document
 */
export function createOrderEventData(order: any): OrderEventData {
  return {
    orderId: order._id.toString(),
    orderNumber: order.orderId,
    customer: {
      name: order.customerName,
      email: order.email,
      phone: order.phone || order.phoneNumber,
      deliveryAddress: order.deliveryAddress ? {
        street: order.deliveryAddress.street,
        city: order.deliveryAddress.city,
        postalCode: order.deliveryAddress.postalCode,
        instructions: order.deliveryAddress.instructions,
      } : undefined,
    },
    items: order.items?.map((item: any) => ({
      productId: item.product?._id?.toString() || item.productId,
      productName: item.product?.name || item.name,
      quantity: item.quantity,
      price: item.price,
      customizations: item.customizations,
      totalPrice: item.quantity * item.price,
    })),
    totalAmount: order.totalAmount,
    deliveryType: order.deliveryType,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
  };
}