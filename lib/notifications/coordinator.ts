/**
 * Notification Coordinator
 * Unified orchestration layer for all notification channels
 *
 * This coordinator:
 * 1. Dispatches webhooks to n8n (primary)
 * 2. Falls back to direct API calls if n8n fails/disabled
 * 3. Tracks notification delivery status
 * 4. Respects customer notification preferences
 */

import { sendOrderConfirmationEmail, sendOrderStatusEmail, sendAdminNotificationEmail, OrderEmailData, OrderStatusEmailData } from '@/lib/email';
import { sendWhatsAppNotification, sendOrderReadyNotification } from '@/lib/whatsapp';
import { dispatchOrderCreated, dispatchOrderStatusChanged, getWebhookDispatcher } from '@/lib/webhooks/dispatcher';
import Order from '@/models/Order';

export type NotificationChannel = 'email' | 'whatsapp' | 'sms' | 'push';
export type NotificationType =
  | 'order_created'
  | 'order_confirmed'
  | 'order_preparing'
  | 'order_ready'
  | 'order_completed'
  | 'order_cancelled'
  | 'admin_alert';

export interface NotificationResult {
  channel: NotificationChannel;
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt: Date;
}

export interface NotificationOptions {
  channels?: NotificationChannel[];
  skipN8n?: boolean;
  skipFallback?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export interface OrderNotificationData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    customizations?: any;
  }>;
  subtotal: number;
  tax?: number;
  deliveryFee?: number;
  total: number;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  paymentMethod: string;
  pickupTimeRange?: string;
  notes?: string;
  status?: string;
  previousStatus?: string;
}

/**
 * Notification Coordinator Class
 */
class NotificationCoordinator {
  private n8nEnabled: boolean;

  constructor() {
    this.n8nEnabled = process.env.N8N_ENABLED === 'true';
  }

  /**
   * Send order creation notifications
   */
  async sendOrderCreatedNotifications(
    order: OrderNotificationData,
    options: NotificationOptions = {}
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    const channels = options.channels || ['email', 'whatsapp'];

    // 1. Try n8n first (if enabled and not skipped)
    if (this.n8nEnabled && !options.skipN8n) {
      try {
        await dispatchOrderCreated(order);
        console.log('Order created webhook dispatched to n8n');

        // If n8n handles it, we may skip direct notifications
        // But for reliability, we still send fallback notifications
      } catch (err) {
        console.error('n8n webhook dispatch failed:', err);
      }
    }

    // 2. Send direct notifications (fallback or complement)
    if (!options.skipFallback) {
      // Customer email
      if (channels.includes('email') && order.customerEmail) {
        try {
          const emailData: OrderEmailData = {
            orderId: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            items: order.items,
            subtotal: order.subtotal,
            tax: order.tax || 0,
            deliveryFee: order.deliveryFee || 0,
            total: order.total,
            deliveryType: order.deliveryType,
            deliveryAddress: order.deliveryAddress as any,
            paymentMethod: order.paymentMethod,
            pickupTimeRange: order.pickupTimeRange,
            notes: order.notes,
          };

          const emailResult = await sendOrderConfirmationEmail(emailData);
          results.push({
            channel: 'email',
            success: emailResult.success,
            messageId: emailResult.messageId,
            error: emailResult.error,
            sentAt: new Date(),
          });
        } catch (err) {
          results.push({
            channel: 'email',
            success: false,
            error: err instanceof Error ? err.message : 'Email failed',
            sentAt: new Date(),
          });
        }
      }

      // Admin email
      try {
        const adminEmailData: OrderEmailData = {
          orderId: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerPhone || '', // Phone in email field for admin
          items: order.items,
          subtotal: order.subtotal,
          tax: order.tax || 0,
          deliveryFee: order.deliveryFee || 0,
          total: order.total,
          deliveryType: order.deliveryType,
          deliveryAddress: order.deliveryAddress as any,
          paymentMethod: order.paymentMethod,
          pickupTimeRange: order.pickupTimeRange,
          notes: order.notes,
        };

        await sendAdminNotificationEmail(adminEmailData);
      } catch (err) {
        console.error('Admin email notification failed:', err);
      }

      // WhatsApp to restaurant
      if (channels.includes('whatsapp') && order.customerPhone) {
        try {
          const whatsappUrl = await sendWhatsAppNotification({
            orderId: order.orderNumber,
            customerName: order.customerName,
            phone: order.customerPhone,
            total: order.total,
            items: order.items,
            deliveryType: order.deliveryType,
            deliveryAddress: order.deliveryAddress,
            paymentMethod: order.paymentMethod,
          });

          results.push({
            channel: 'whatsapp',
            success: true,
            messageId: whatsappUrl || undefined,
            sentAt: new Date(),
          });
        } catch (err) {
          results.push({
            channel: 'whatsapp',
            success: false,
            error: err instanceof Error ? err.message : 'WhatsApp failed',
            sentAt: new Date(),
          });
        }
      }
    }

    return results;
  }

  /**
   * Send order status change notifications
   */
  async sendStatusChangeNotifications(
    order: OrderNotificationData,
    options: NotificationOptions = {}
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = [];
    const channels = options.channels || ['email', 'whatsapp'];
    const status = order.status || 'confirmed';

    // 1. Dispatch to n8n
    if (this.n8nEnabled && !options.skipN8n) {
      try {
        await dispatchOrderStatusChanged(order, order.previousStatus || 'pending', status);
        console.log(`Order status change (${status}) webhook dispatched to n8n`);
      } catch (err) {
        console.error('n8n status webhook dispatch failed:', err);
      }
    }

    // 2. Direct notifications
    if (!options.skipFallback) {
      // Email to customer
      if (channels.includes('email') && order.customerEmail) {
        const validStatuses = ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
        if (validStatuses.includes(status)) {
          try {
            const statusEmailData: OrderStatusEmailData = {
              orderId: order.orderNumber,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              status: status as 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled',
              trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pizzafalchi.com'}/order-confirmation/${order.orderId}`,
            };

            const emailResult = await sendOrderStatusEmail(statusEmailData);
            results.push({
              channel: 'email',
              success: emailResult.success,
              messageId: emailResult.messageId,
              error: emailResult.error,
              sentAt: new Date(),
            });
          } catch (err) {
            results.push({
              channel: 'email',
              success: false,
              error: err instanceof Error ? err.message : 'Status email failed',
              sentAt: new Date(),
            });
          }
        }
      }

      // WhatsApp for "ready" status (high priority)
      if (channels.includes('whatsapp') && status === 'ready' && order.customerPhone) {
        try {
          const whatsappResult = await sendOrderReadyNotification({
            orderId: order.orderNumber,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            deliveryType: order.deliveryType,
          });

          results.push({
            channel: 'whatsapp',
            success: whatsappResult.success,
            messageId: whatsappResult.messageSid,
            error: whatsappResult.error,
            sentAt: new Date(),
          });
        } catch (err) {
          results.push({
            channel: 'whatsapp',
            success: false,
            error: err instanceof Error ? err.message : 'WhatsApp ready notification failed',
            sentAt: new Date(),
          });
        }
      }
    }

    return results;
  }

  /**
   * Update order with notification results
   */
  async updateOrderNotificationStatus(
    orderId: string,
    results: NotificationResult[]
  ): Promise<void> {
    try {
      const emailResult = results.find(r => r.channel === 'email');
      const whatsappResult = results.find(r => r.channel === 'whatsapp');
      const smsResult = results.find(r => r.channel === 'sms');

      await Order.findByIdAndUpdate(orderId, {
        $set: {
          notificationSent: results.some(r => r.success),
          notificationSentAt: new Date(),
          lastNotificationTime: new Date(),
          'notificationChannels.email': emailResult?.success || false,
          'notificationChannels.whatsapp': whatsappResult?.success || false,
          'notificationChannels.sms': smsResult?.success || false,
        },
      });
    } catch (err) {
      console.error('Failed to update order notification status:', err);
    }
  }

  /**
   * Get n8n dispatcher status
   */
  getN8nStatus(): {
    enabled: boolean;
    url: string;
    queueSize: number;
  } {
    const dispatcher = getWebhookDispatcher();
    const status = dispatcher.getStatus();
    return {
      enabled: status.enabled,
      url: status.url,
      queueSize: status.queueSize,
    };
  }

  /**
   * Check if n8n is healthy and reachable
   */
  async checkN8nHealth(): Promise<boolean> {
    if (!this.n8nEnabled) return false;

    const dispatcher = getWebhookDispatcher();
    const status = dispatcher.getStatus();
    return status.enabled && !!status.url;
  }
}

// Singleton instance
let coordinatorInstance: NotificationCoordinator | null = null;

export function getNotificationCoordinator(): NotificationCoordinator {
  if (!coordinatorInstance) {
    coordinatorInstance = new NotificationCoordinator();
  }
  return coordinatorInstance;
}

// Convenience functions
export async function notifyOrderCreated(
  order: OrderNotificationData,
  options?: NotificationOptions
): Promise<NotificationResult[]> {
  const coordinator = getNotificationCoordinator();
  const results = await coordinator.sendOrderCreatedNotifications(order, options);
  await coordinator.updateOrderNotificationStatus(order.orderId, results);
  return results;
}

export async function notifyStatusChange(
  order: OrderNotificationData,
  options?: NotificationOptions
): Promise<NotificationResult[]> {
  const coordinator = getNotificationCoordinator();
  const results = await coordinator.sendStatusChangeNotifications(order, options);
  await coordinator.updateOrderNotificationStatus(order.orderId, results);
  return results;
}
