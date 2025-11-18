/**
 * Webhook Dispatcher
 * Sends webhook events to n8n and manages deliveries
 */

import { WebhookEventType, WebhookPayload, WebhookDelivery, WebhookDeliveryStatus } from '@/types/webhooks';
import { createWebhookHeaders } from './signatures';
import { retryWebhookDelivery, WebhookRetryQueue } from './retry';
import { webhookEvents } from './events';
import { v4 as uuidv4 } from 'uuid';

/**
 * Webhook dispatcher configuration
 */
export interface DispatcherConfig {
  webhookUrl: string;
  webhookSecret: string;
  enabled: boolean;
  maxAttempts: number;
  retryDelayMs: number;
  timeoutMs: number;
  queueEnabled: boolean;
}

/**
 * Default dispatcher configuration
 */
const DEFAULT_CONFIG: DispatcherConfig = {
  webhookUrl: process.env.N8N_WEBHOOK_URL || '',
  webhookSecret: process.env.N8N_WEBHOOK_SECRET || '',
  enabled: process.env.N8N_ENABLED === 'true',
  maxAttempts: parseInt(process.env.N8N_RETRY_ATTEMPTS || '5'),
  retryDelayMs: parseInt(process.env.N8N_RETRY_DELAY_MS || '1000'),
  timeoutMs: parseInt(process.env.N8N_TIMEOUT_MS || '30000'),
  queueEnabled: true,
};

/**
 * Webhook Dispatcher Class
 */
export class WebhookDispatcher {
  private config: DispatcherConfig;
  private retryQueue: WebhookRetryQueue | null = null;
  private deliveries: Map<string, WebhookDelivery> = new Map();

  constructor(config?: Partial<DispatcherConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    // Initialize retry queue if enabled
    if (this.config.queueEnabled) {
      this.retryQueue = new WebhookRetryQueue(
        (id, result) => this.handleDeliveryResult(id, result),
        5000 // Check queue every 5 seconds
      );
    }

    // Register event listeners
    this.registerEventListeners();
  }

  /**
   * Register listeners for all webhook events
   */
  private registerEventListeners(): void {
    // Order events
    Object.values(WebhookEventType).forEach(eventType => {
      webhookEvents.onWebhook(eventType, async (event) => {
        await this.dispatch(event);
      });
    });
  }

  /**
   * Dispatch webhook event to n8n
   */
  async dispatch(event: WebhookPayload): Promise<WebhookDelivery> {
    // Check if webhook is enabled
    if (!this.config.enabled) {
      console.log('Webhook dispatch skipped - webhooks disabled');
      return this.createDeliveryRecord(event, WebhookDeliveryStatus.PENDING);
    }

    // Check if URL is configured
    if (!this.config.webhookUrl) {
      console.error('Webhook dispatch failed - no URL configured');
      return this.createDeliveryRecord(event, WebhookDeliveryStatus.FAILED);
    }

    // Create delivery record
    const delivery = this.createDeliveryRecord(event, WebhookDeliveryStatus.PENDING);
    this.deliveries.set(delivery.id, delivery);

    // Create webhook headers
    const headers = createWebhookHeaders(
      event,
      this.config.webhookSecret,
      event.eventType
    );

    // Attempt delivery
    try {
      const result = await retryWebhookDelivery(
        this.config.webhookUrl,
        event,
        headers,
        {
          maxAttempts: this.config.maxAttempts,
          initialDelayMs: this.config.retryDelayMs,
        }
      );

      if (result.success) {
        delivery.status = WebhookDeliveryStatus.SUCCESS;
        delivery.completedAt = new Date();
        console.log(`Webhook delivered successfully: ${event.eventType} - ${event.eventId}`);
      } else {
        delivery.status = WebhookDeliveryStatus.FAILED;

        // Add to retry queue if available
        if (this.retryQueue && this.config.queueEnabled) {
          this.retryQueue.add(
            delivery.id,
            this.config.webhookUrl,
            event,
            headers,
            {
              maxAttempts: this.config.maxAttempts,
              initialDelayMs: this.config.retryDelayMs,
            }
          );
          delivery.status = WebhookDeliveryStatus.RETRYING;
          console.log(`Webhook added to retry queue: ${event.eventType} - ${event.eventId}`);
        }
      }

      // Update delivery record with attempts
      delivery.attempts = Array.from({ length: result.attempts }, (_, i) => ({
        attemptNumber: i + 1,
        timestamp: new Date(),
        status: i === result.attempts - 1 && result.success
          ? WebhookDeliveryStatus.SUCCESS
          : WebhookDeliveryStatus.FAILED,
        duration: Math.floor(result.totalDuration / result.attempts),
      }));

      delivery.updatedAt = new Date();
    } catch (error) {
      console.error('Webhook dispatch error:', error);
      delivery.status = WebhookDeliveryStatus.FAILED;
      delivery.updatedAt = new Date();
    }

    return delivery;
  }

  /**
   * Dispatch custom event
   */
  async dispatchCustom(
    eventType: WebhookEventType,
    data: any,
    metadata?: any
  ): Promise<WebhookDelivery> {
    const event: WebhookPayload = {
      eventId: uuidv4(),
      eventType,
      timestamp: new Date(),
      webhookVersion: '1.0',
      metadata: {
        source: 'pizza-falchi-api',
        correlationId: uuidv4(),
        ...metadata,
      },
      data,
    } as any;

    return this.dispatch(event);
  }

  /**
   * Create delivery record
   */
  private createDeliveryRecord(
    event: WebhookPayload,
    status: WebhookDeliveryStatus
  ): WebhookDelivery {
    return {
      id: uuidv4(),
      eventId: event.eventId,
      eventType: event.eventType,
      webhookUrl: this.config.webhookUrl,
      payload: event,
      status,
      attempts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Handle delivery result from retry queue
   */
  private handleDeliveryResult(deliveryId: string, result: any): void {
    const delivery = this.deliveries.get(deliveryId);
    if (delivery) {
      if (result.success) {
        delivery.status = WebhookDeliveryStatus.SUCCESS;
        delivery.completedAt = new Date();
      } else {
        delivery.status = WebhookDeliveryStatus.FAILED;
      }
      delivery.updatedAt = new Date();
    }
  }

  /**
   * Get delivery by ID
   */
  getDelivery(id: string): WebhookDelivery | undefined {
    return this.deliveries.get(id);
  }

  /**
   * Get all deliveries
   */
  getDeliveries(
    eventType?: WebhookEventType,
    status?: WebhookDeliveryStatus,
    limit?: number
  ): WebhookDelivery[] {
    let deliveries = Array.from(this.deliveries.values());

    if (eventType) {
      deliveries = deliveries.filter(d => d.eventType === eventType);
    }

    if (status) {
      deliveries = deliveries.filter(d => d.status === status);
    }

    // Sort by creation date (newest first)
    deliveries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (limit) {
      deliveries = deliveries.slice(0, limit);
    }

    return deliveries;
  }

  /**
   * Get dispatcher status
   */
  getStatus(): {
    enabled: boolean;
    url: string;
    queueSize: number;
    deliveries: {
      total: number;
      success: number;
      failed: number;
      pending: number;
      retrying: number;
    };
  } {
    const deliveryStats = {
      total: this.deliveries.size,
      success: 0,
      failed: 0,
      pending: 0,
      retrying: 0,
    };

    this.deliveries.forEach(delivery => {
      switch (delivery.status) {
        case WebhookDeliveryStatus.SUCCESS:
          deliveryStats.success++;
          break;
        case WebhookDeliveryStatus.FAILED:
          deliveryStats.failed++;
          break;
        case WebhookDeliveryStatus.PENDING:
          deliveryStats.pending++;
          break;
        case WebhookDeliveryStatus.RETRYING:
          deliveryStats.retrying++;
          break;
      }
    });

    return {
      enabled: this.config.enabled,
      url: this.config.webhookUrl,
      queueSize: this.retryQueue?.size() || 0,
      deliveries: deliveryStats,
    };
  }

  /**
   * Clear delivery history
   */
  clearHistory(): void {
    this.deliveries.clear();
  }

  /**
   * Enable/disable webhook dispatch
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Update webhook URL
   */
  setWebhookUrl(url: string): void {
    this.config.webhookUrl = url;
  }

  /**
   * Update webhook secret
   */
  setWebhookSecret(secret: string): void {
    this.config.webhookSecret = secret;
  }

  /**
   * Destroy dispatcher
   */
  destroy(): void {
    if (this.retryQueue) {
      this.retryQueue.destroy();
      this.retryQueue = null;
    }
    this.deliveries.clear();
  }
}

// Create singleton instance
let dispatcher: WebhookDispatcher | null = null;

/**
 * Get or create webhook dispatcher instance
 */
export function getWebhookDispatcher(config?: Partial<DispatcherConfig>): WebhookDispatcher {
  if (!dispatcher) {
    dispatcher = new WebhookDispatcher(config);
  }
  return dispatcher;
}

/**
 * Dispatch webhook event (convenience function)
 */
export async function dispatchWebhook(event: WebhookPayload): Promise<void> {
  const dispatcher = getWebhookDispatcher();
  await dispatcher.dispatch(event);
}

/**
 * Dispatch order created webhook
 */
export async function dispatchOrderCreated(orderData: any): Promise<void> {
  const dispatcher = getWebhookDispatcher();

  const event: WebhookPayload = {
    eventId: uuidv4(),
    eventType: WebhookEventType.ORDER_CREATED,
    timestamp: new Date(),
    webhookVersion: '1.0',
    metadata: {
      source: 'pizza-falchi-api',
      correlationId: uuidv4(),
    },
    data: {
      orderId: orderData._id.toString(),
      orderNumber: orderData.orderId,
      customer: {
        name: orderData.customerName,
        email: orderData.email,
        phone: orderData.phone || orderData.phoneNumber,
        deliveryAddress: orderData.deliveryAddress,
      },
      items: orderData.items.map((item: any) => ({
        productId: item.product?._id?.toString() || item.productId,
        productName: item.product?.name || item.name,
        quantity: item.quantity,
        price: item.price,
        customizations: item.customizations,
        totalPrice: item.quantity * item.price,
      })),
      subtotal: orderData.totalAmount - (orderData.deliveryFee || 0),
      deliveryFee: orderData.deliveryFee || 0,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      deliveryType: orderData.deliveryType,
      notes: orderData.notes,
      createdAt: orderData.createdAt,
    },
  } as any;

  await dispatcher.dispatch(event);
}

/**
 * Dispatch order status changed webhook
 */
export async function dispatchOrderStatusChanged(
  orderData: any,
  previousStatus: string,
  newStatus: string
): Promise<void> {
  const eventType = getEventTypeForStatus(newStatus);
  if (!eventType) {
    console.warn(`No webhook event type for status: ${newStatus}`);
    return;
  }

  const dispatcher = getWebhookDispatcher();

  const event: WebhookPayload = {
    eventId: uuidv4(),
    eventType,
    timestamp: new Date(),
    webhookVersion: '1.0',
    metadata: {
      source: 'pizza-falchi-api',
      correlationId: uuidv4(),
    },
    data: {
      orderId: orderData._id.toString(),
      orderNumber: orderData.orderId,
      previousStatus,
      newStatus,
      statusChangedAt: new Date(),
      customer: {
        name: orderData.customerName,
        phone: orderData.phone || orderData.phoneNumber,
        email: orderData.email,
      },
    },
  } as any;

  await dispatcher.dispatch(event);
}

/**
 * Map order status to webhook event type
 */
function getEventTypeForStatus(status: string): WebhookEventType | null {
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