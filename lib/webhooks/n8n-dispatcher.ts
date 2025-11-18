/**
 * n8n Webhook Dispatcher
 * Sends order events to n8n workflows for automation
 */

import { WebhookEventType } from '@/types/webhooks';

// Configuration for n8n webhooks
const N8N_CONFIG = {
  // Check if n8n is enabled
  enabled: process.env.N8N_ENABLED === 'true',

  // Using the No Crypto webhook that works without $helpers
  // For production, use your n8n cloud instance or self-hosted URL
  baseUrl: process.env.N8N_BASE_URL || process.env.N8N_URL || 'http://localhost:5678',

  endpoints: {
    orderProcessing: '/webhook/pizza-order-nocrypto',
    whatsapp: '/webhook/pizza-order-whatsapp',
    statusUpdate: '/webhook/pizza-status-update',
    notification: '/webhook/pizza-notification'
  },

  timeout: parseInt(process.env.N8N_TIMEOUT_MS || '10000'),
  retryAttempts: parseInt(process.env.N8N_RETRY_ATTEMPTS || '3'),
  retryDelay: parseInt(process.env.N8N_RETRY_DELAY_MS || '1000'),

  // WhatsApp target number
  whatsappTargetPhone: process.env.WHATSAPP_TARGET_PHONE || '+33601289283'
};

export interface N8nOrderEvent {
  eventType: WebhookEventType;
  timestamp: string;
  orderId: string;
  data: {
    orderId: string;
    orderNumber: string;
    customer: {
      name: string;
      email?: string;
      phone: string;
    };
    items?: Array<{
      productId: string;
      productName: string;
      quantity: number;
      price: number;
      totalPrice: number;
    }>;
    totalAmount: number;
    deliveryType?: 'pickup' | 'delivery';
    deliveryAddress?: {
      street: string;
      city: string;
      postalCode: string;
    };
    status?: string;
    notes?: string;
    paymentMethod?: string;
  };
  metadata?: {
    source: string;
    version: string;
    environment: string;
    previousStatus?: string;
    newStatus?: string;
    [key: string]: any;
  };
}

class N8nDispatcher {
  private async sendWebhook(
    endpoint: string,
    payload: N8nOrderEvent,
    attempt: number = 1
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    // Check if n8n is enabled
    if (!N8N_CONFIG.enabled) {
      console.log('[n8n Dispatcher] n8n integration is disabled');
      return { success: true, data: { message: 'n8n is disabled' } };
    }

    const url = `${N8N_CONFIG.baseUrl}${endpoint}`;

    try {
      console.log(`[n8n Dispatcher] Sending ${payload.eventType} to ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source': 'pizza-falchi',
          'X-Event-Type': payload.eventType
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(N8N_CONFIG.timeout)
      });

      const contentType = response.headers.get('content-type');
      let responseData = null;

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        console.log(`[n8n Dispatcher] ✓ Webhook sent successfully`);
        return { success: true, data: responseData };
      } else {
        // Don't retry 4xx errors
        if (response.status >= 400 && response.status < 500) {
          console.error(`[n8n Dispatcher] Client error: ${response.status}`);
          return { success: false, error: `Client error: ${response.status}` };
        }

        // Retry 5xx errors
        if (attempt < N8N_CONFIG.retryAttempts) {
          console.log(`[n8n Dispatcher] Retrying (attempt ${attempt + 1}/${N8N_CONFIG.retryAttempts})...`);
          await new Promise(resolve => setTimeout(resolve, N8N_CONFIG.retryDelay * attempt));
          return this.sendWebhook(endpoint, payload, attempt + 1);
        }

        return { success: false, error: `Server error: ${response.status}` };
      }

    } catch (error) {
      console.error(`[n8n Dispatcher] Error sending webhook:`, error);

      // Retry on network errors
      if (attempt < N8N_CONFIG.retryAttempts) {
        console.log(`[n8n Dispatcher] Retrying after error (attempt ${attempt + 1}/${N8N_CONFIG.retryAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, N8N_CONFIG.retryDelay * attempt));
        return this.sendWebhook(endpoint, payload, attempt + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send order created event to n8n
   */
  async orderCreated(order: any): Promise<void> {
    const event: N8nOrderEvent = {
      eventType: WebhookEventType.ORDER_CREATED,
      timestamp: new Date().toISOString(),
      orderId: order._id?.toString() || order.id,
      data: {
        orderId: order._id?.toString() || order.id,
        orderNumber: order.orderNumber || order.orderId || order._id?.toString().slice(-6).toUpperCase(),
        customer: {
          name: order.customer?.name || order.customerName,
          email: order.customer?.email || order.email,
          phone: order.customer?.phone || order.phone
        },
        items: order.items?.map((item: any) => ({
          productId: item.productId || item.product?._id,
          productName: item.productName || item.product?.name || item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice || item.total || (item.quantity * item.price)
        })) || [],
        totalAmount: order.totalAmount || order.total,
        deliveryType: order.deliveryType,
        deliveryAddress: order.deliveryAddress,
        notes: order.notes,
        paymentMethod: order.paymentMethod
      },
      metadata: {
        source: 'pizza-falchi',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    };

    // Send to WhatsApp webhook for notifications
    const whatsappResult = await this.sendWebhook(N8N_CONFIG.endpoints.whatsapp, event);
    if (!whatsappResult.success) {
      console.error(`[n8n Dispatcher] Failed to send WhatsApp notification:`, whatsappResult.error);
    }

    // Also send to general processing webhook
    const result = await this.sendWebhook(N8N_CONFIG.endpoints.orderProcessing, event);
    if (!result.success) {
      console.error(`[n8n Dispatcher] Failed to send order created event:`, result.error);
      // In production, you might want to queue this for retry or alert
    }
  }

  /**
   * Send order status update event to n8n
   */
  async orderStatusUpdated(
    order: any,
    previousStatus: string,
    newStatus: string
  ): Promise<void> {
    // Map status to event type
    const statusToEventType: Record<string, WebhookEventType> = {
      'confirmed': WebhookEventType.ORDER_CONFIRMED,
      'preparing': WebhookEventType.ORDER_PREPARING,
      'ready': WebhookEventType.ORDER_READY,
      'in_delivery': WebhookEventType.ORDER_IN_DELIVERY,
      'completed': WebhookEventType.ORDER_COMPLETED,
      'cancelled': WebhookEventType.ORDER_CANCELLED,
    };

    const eventType = statusToEventType[newStatus] || WebhookEventType.ORDER_CONFIRMED;

    const event: N8nOrderEvent = {
      eventType,
      timestamp: new Date().toISOString(),
      orderId: order._id?.toString() || order.id,
      data: {
        orderId: order._id?.toString() || order.id,
        orderNumber: order.orderNumber || order.orderId || order._id?.toString().slice(-6).toUpperCase(),
        customer: {
          name: order.customer?.name || order.customerName,
          phone: order.customer?.phone || order.phone,
          email: order.customer?.email || order.email
        },
        totalAmount: order.totalAmount || order.total,
        status: newStatus,
        deliveryType: order.deliveryType,
        deliveryAddress: order.deliveryAddress
      },
      metadata: {
        source: 'pizza-falchi',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        previousStatus,
        newStatus
      }
    };

    // Send to WhatsApp webhook for notifications
    const whatsappResult = await this.sendWebhook(N8N_CONFIG.endpoints.whatsapp, event);
    if (!whatsappResult.success) {
      console.error(`[n8n Dispatcher] Failed to send WhatsApp notification:`, whatsappResult.error);
    }

    // Also send to general processing webhook
    const result = await this.sendWebhook(N8N_CONFIG.endpoints.orderProcessing, event);
    if (!result.success) {
      console.error(`[n8n Dispatcher] Failed to send status update event:`, result.error);
    }
  }

  /**
   * Send order confirmed event
   */
  async orderConfirmed(order: any): Promise<void> {
    const event: N8nOrderEvent = {
      eventType: WebhookEventType.ORDER_CONFIRMED,
      timestamp: new Date().toISOString(),
      orderId: order._id?.toString() || order.id,
      data: {
        orderId: order._id?.toString() || order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email
        },
        totalAmount: order.totalAmount,
        status: 'confirmed',
        deliveryType: order.deliveryType
      }
    };

    const result = await this.sendWebhook(N8N_CONFIG.endpoints.orderProcessing, event);

    if (!result.success) {
      console.error(`[n8n Dispatcher] Failed to send order confirmed event:`, result.error);
    }
  }

  /**
   * Send order ready event
   */
  async orderReady(order: any): Promise<void> {
    const event: N8nOrderEvent = {
      eventType: WebhookEventType.ORDER_READY,
      timestamp: new Date().toISOString(),
      orderId: order._id?.toString() || order.id,
      data: {
        orderId: order._id?.toString() || order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email
        },
        totalAmount: order.totalAmount,
        status: 'ready',
        deliveryType: order.deliveryType
      }
    };

    const result = await this.sendWebhook(N8N_CONFIG.endpoints.orderProcessing, event);

    if (!result.success) {
      console.error(`[n8n Dispatcher] Failed to send order ready event:`, result.error);
    }
  }

  /**
   * Send order completed event
   */
  async orderCompleted(order: any): Promise<void> {
    const event: N8nOrderEvent = {
      eventType: WebhookEventType.ORDER_COMPLETED,
      timestamp: new Date().toISOString(),
      orderId: order._id?.toString() || order.id,
      data: {
        orderId: order._id?.toString() || order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email
        },
        totalAmount: order.totalAmount,
        status: 'completed'
      }
    };

    const result = await this.sendWebhook(N8N_CONFIG.endpoints.orderProcessing, event);

    if (!result.success) {
      console.error(`[n8n Dispatcher] Failed to send order completed event:`, result.error);
    }
  }

  /**
   * Send order cancelled event
   */
  async orderCancelled(order: any, reason?: string): Promise<void> {
    const event: N8nOrderEvent = {
      eventType: WebhookEventType.ORDER_CANCELLED,
      timestamp: new Date().toISOString(),
      orderId: order._id?.toString() || order.id,
      data: {
        orderId: order._id?.toString() || order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email
        },
        totalAmount: order.totalAmount,
        status: 'cancelled',
        notes: reason
      }
    };

    const result = await this.sendWebhook(N8N_CONFIG.endpoints.orderProcessing, event);

    if (!result.success) {
      console.error(`[n8n Dispatcher] Failed to send order cancelled event:`, result.error);
    }
  }

  /**
   * Test connection to n8n
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(N8N_CONFIG.baseUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch (error) {
      console.error('[n8n Dispatcher] Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const n8nDispatcher = new N8nDispatcher();

// Export for testing
export default N8nDispatcher;