/**
 * n8n Webhook Receiver Endpoint
 * Receives webhook events from n8n workflows
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyN8nWebhook } from '@/lib/webhooks/signatures';
import { N8nWebhookRequestSchema } from '@/lib/webhooks/schemas';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { webhookEvents } from '@/lib/webhooks/events';
import { WebhookEventType } from '@/types/webhooks';
import { sendOrderConfirmationEmail, sendOrderStatusEmail, sendAbandonedCartEmail } from '@/lib/email';
import { sendWhatsAppNotification, sendOrderReadyNotification } from '@/lib/whatsapp';

/**
 * Rate limiter for webhook endpoints
 */
const webhookAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const attempt = webhookAttempts.get(ip);

  if (!attempt || attempt.resetAt < now) {
    webhookAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (attempt.count >= limit) {
    return false;
  }

  attempt.count++;
  return true;
}

/**
 * POST /api/webhooks/n8n
 * Receive webhook events from n8n
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
          },
        },
        { status: 429 }
      );
    }

    // Get webhook secret from environment
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('N8N_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIG_ERROR',
            message: 'Webhook not configured',
          },
        },
        { status: 500 }
      );
    }

    // Verify webhook signature
    const verification = await verifyN8nWebhook(request, webhookSecret);
    if (!verification.valid) {
      console.error('Webhook verification failed:', verification.error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_SIGNATURE',
            message: verification.error || 'Invalid webhook signature',
          },
        },
        { status: 401 }
      );
    }

    // Validate payload schema
    const validation = N8nWebhookRequestSchema.safeParse(verification.payload);
    if (!validation.success) {
      console.error('Webhook payload validation failed:', validation.error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PAYLOAD',
            message: 'Invalid webhook payload',
            details: validation.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { action, orderId, data, metadata } = validation.data;

    // Connect to database
    await connectDB();

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: `Order ${orderId} not found`,
          },
        },
        { status: 404 }
      );
    }

    // Process the webhook action
    let result: any = {};

    switch (action) {
      case 'update_order_status':
        if (data.status) {
          const previousStatus = order.status;
          order.status = data.status;

          if (data.statusReason) {
            order.notes = `${order.notes ? order.notes + '\n' : ''}Status changed: ${data.statusReason}`;
          }

          await order.save();

          // Emit status change event
          const eventType = getEventTypeForStatus(data.status);
          if (eventType) {
            await webhookEvents.emitOrderStatusChanged(eventType, {
              orderId: order._id.toString(),
              orderNumber: order.orderId,
              previousStatus,
              newStatus: data.status,
              customer: {
                name: order.customerName,
                email: order.email,
                phone: order.phone || order.phoneNumber,
              },
            });
          }

          result = {
            orderId: order._id,
            orderNumber: order.orderId,
            previousStatus,
            newStatus: data.status,
          };
        }
        break;

      case 'assign_driver':
        if (data.driver) {
          // Update order with driver information
          order.deliveryDriver = {
            id: data.driver.id,
            name: data.driver.name,
            phone: data.driver.phone,
            vehicle: data.driver.vehicle,
            licensePlate: data.driver.licensePlate,
            assignedAt: new Date(),
          };

          if (data.estimatedDeliveryTime) {
            order.estimatedDelivery = new Date(data.estimatedDeliveryTime);
          }

          order.deliveryStatus = 'assigned';
          await order.save();

          // Emit driver assigned event
          await webhookEvents.emitDriverAssigned(
            order._id.toString(),
            order.orderId,
            data.driver,
            {
              pickup: data.estimatedPickupTime ? new Date(data.estimatedPickupTime) : new Date(),
              delivery: data.estimatedDeliveryTime ? new Date(data.estimatedDeliveryTime) : new Date(),
            }
          );

          result = {
            orderId: order._id,
            orderNumber: order.orderId,
            driver: data.driver,
          };
        }
        break;

      case 'update_kds':
        if (data.kdsStatus) {
          order.kdsStatus = data.kdsStatus;

          if (data.kdsStatus === 'acknowledged') {
            order.kdsAcknowledgedAt = new Date();
          } else if (data.kdsStatus === 'completed') {
            order.preparationCompletedAt = new Date();

            if (data.preparationTime) {
              order.actualPreparationTime = data.preparationTime;
            }
          }

          await order.save();

          // Emit KDS event
          const kdsEventType = data.kdsStatus === 'acknowledged'
            ? WebhookEventType.KDS_ACKNOWLEDGED
            : WebhookEventType.KDS_COMPLETED;

          await webhookEvents.emitKDSEvent(
            kdsEventType,
            order._id.toString(),
            order.orderId,
            order.items.map((item: any) => ({
              productId: item.product?._id?.toString() || item.productId,
              productName: item.product?.name || item.name,
              quantity: item.quantity,
              price: item.price,
              customizations: item.customizations,
              totalPrice: item.quantity * item.price,
            })),
            data.preparationTime
          );

          result = {
            orderId: order._id,
            orderNumber: order.orderId,
            kdsStatus: data.kdsStatus,
          };
        }
        break;

      case 'send_notification':
        // Actually send the notification based on type and channel
        const notificationResults: Record<string, any> = {};
        const populatedOrder = await Order.findById(orderId).populate('items.product').lean() as any;

        if (!populatedOrder) {
          return NextResponse.json(
            { success: false, error: { code: 'ORDER_NOT_FOUND', message: 'Order not found for notification' } },
            { status: 404 }
          );
        }

        // Send email notifications
        if (data.channel === 'email' || data.channel === 'all') {
          if (populatedOrder.email) {
            if (data.notificationType === 'order_confirmation') {
              const emailResult = await sendOrderConfirmationEmail({
                orderId: populatedOrder.orderId || populatedOrder._id.toString().slice(-6).toUpperCase(),
                customerName: populatedOrder.customerName,
                customerEmail: populatedOrder.email,
                items: populatedOrder.items.map((item: any) => ({
                  name: item.product?.name || 'Produit',
                  quantity: item.quantity,
                  price: item.price,
                  customizations: item.customizations,
                })),
                subtotal: populatedOrder.subtotal,
                tax: populatedOrder.tax || 0,
                deliveryFee: populatedOrder.deliveryFee || 0,
                total: populatedOrder.total,
                deliveryType: populatedOrder.deliveryType,
                deliveryAddress: populatedOrder.deliveryAddress,
                paymentMethod: populatedOrder.paymentMethod,
                pickupTimeRange: populatedOrder.pickupTimeRange,
                notes: populatedOrder.notes,
              });
              notificationResults.email = emailResult;
            } else if (data.notificationType === 'order_status') {
              const statusEmailResult = await sendOrderStatusEmail({
                orderId: populatedOrder.orderId || populatedOrder._id.toString().slice(-6).toUpperCase(),
                customerName: populatedOrder.customerName,
                customerEmail: populatedOrder.email,
                status: data.status || populatedOrder.status,
                trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pizzafalchi.com'}/order-confirmation/${populatedOrder._id}`,
              });
              notificationResults.email = statusEmailResult;
            } else if (data.notificationType === 'abandoned_cart' && data.cartData) {
              const cartEmailResult = await sendAbandonedCartEmail({
                email: populatedOrder.email,
                customerName: populatedOrder.customerName,
                items: data.cartData.items || [],
                totalValue: data.cartData.totalValue || 0,
                cartUrl: data.cartData.cartUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://pizzafalchi.com'}/cart`,
              });
              notificationResults.email = cartEmailResult;
            }

            order.notificationChannels = {
              ...order.notificationChannels,
              email: true,
            };
          }
        }

        // Send WhatsApp notifications
        if (data.channel === 'whatsapp' || data.channel === 'all') {
          const phone = populatedOrder.phone || populatedOrder.phoneNumber;
          if (phone) {
            if (data.notificationType === 'order_ready') {
              const whatsappResult = await sendOrderReadyNotification({
                orderId: populatedOrder.orderId || populatedOrder._id.toString().slice(-6).toUpperCase(),
                customerName: populatedOrder.customerName,
                customerPhone: phone,
                deliveryType: populatedOrder.deliveryType,
              });
              notificationResults.whatsapp = whatsappResult;
            } else if (data.notificationType === 'order_confirmation') {
              try {
                const whatsappUrl = await sendWhatsAppNotification({
                  orderId: populatedOrder._id.toString().slice(-6).toUpperCase(),
                  customerName: populatedOrder.customerName,
                  phone: phone,
                  total: populatedOrder.total,
                  items: populatedOrder.items.map((item: any) => ({
                    name: item.product?.name || 'Produit',
                    quantity: item.quantity,
                    price: item.price,
                  })),
                  deliveryType: populatedOrder.deliveryType,
                  deliveryAddress: populatedOrder.deliveryAddress,
                  paymentMethod: populatedOrder.paymentMethod,
                });
                notificationResults.whatsapp = { success: true, url: whatsappUrl };
              } catch (err) {
                notificationResults.whatsapp = { success: false, error: String(err) };
              }
            }

            order.notificationSent = true;
            order.notificationChannels = {
              ...order.notificationChannels,
              whatsapp: true,
            };
          }
        }

        order.lastNotificationTime = new Date();
        order.notificationSentAt = new Date();
        await order.save();

        result = {
          orderId: order._id,
          orderNumber: order.orderId,
          notificationType: data.notificationType,
          channel: data.channel,
          results: notificationResults,
        };
        break;

      case 'update_delivery_status':
        if (data.deliveryStatus) {
          order.deliveryStatus = data.deliveryStatus;

          if (data.currentLocation) {
            order.currentLocation = {
              latitude: data.currentLocation.latitude,
              longitude: data.currentLocation.longitude,
              updatedAt: new Date(),
            };
          }

          if (data.deliveryStatus === 'delivered') {
            order.actualDeliveryTime = new Date();
            order.status = 'completed';
          }

          await order.save();

          result = {
            orderId: order._id,
            orderNumber: order.orderId,
            deliveryStatus: data.deliveryStatus,
            currentLocation: data.currentLocation,
          };
        }
        break;

      case 'cancel_order':
        order.status = 'cancelled';

        if (data.cancellationReason) {
          order.cancellationReason = data.cancellationReason;
        }

        if (data.refundAmount !== undefined) {
          order.refundAmount = data.refundAmount;
          order.refundStatus = data.refundStatus || 'pending';
        }

        await order.save();

        // Emit cancellation event
        await webhookEvents.emitOrderStatusChanged(WebhookEventType.ORDER_CANCELLED, {
          orderId: order._id.toString(),
          orderNumber: order.orderId,
          previousStatus: order.status,
          newStatus: 'cancelled',
          customer: {
            name: order.customerName,
            email: order.email,
            phone: order.phone || order.phoneNumber,
          },
          metadata: {
            cancellationReason: data.cancellationReason,
          },
        });

        result = {
          orderId: order._id,
          orderNumber: order.orderId,
          status: 'cancelled',
          cancellationReason: data.cancellationReason,
        };
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNKNOWN_ACTION',
              message: `Unknown action: ${action}`,
            },
          },
          { status: 400 }
        );
    }

    // Log webhook event
    console.log(`n8n webhook processed: ${action} for order ${order.orderId}`);

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Action '${action}' processed successfully`,
      data: result,
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process webhook',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/n8n
 * Health check and documentation endpoint
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'n8n webhook endpoint is active',
    version: '1.0',
    timestamp: new Date().toISOString(),
    documentation: {
      description: 'n8n Webhook Receiver for Pizza Falchi - receives commands from n8n workflows',
      authentication: 'HMAC signature required (x-webhook-signature, x-webhook-timestamp)',
      supportedActions: [
        {
          action: 'update_order_status',
          description: 'Update order status',
          requiredFields: ['orderId', 'data.status'],
          statuses: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
        },
        {
          action: 'send_notification',
          description: 'Send email/WhatsApp notifications to customers',
          requiredFields: ['orderId', 'data.notificationType', 'data.channel'],
          notificationTypes: ['order_confirmation', 'order_status', 'order_ready', 'abandoned_cart'],
          channels: ['email', 'whatsapp', 'all'],
        },
        {
          action: 'assign_driver',
          description: 'Assign a delivery driver to an order',
          requiredFields: ['orderId', 'data.driver'],
        },
        {
          action: 'update_kds',
          description: 'Update Kitchen Display System status',
          requiredFields: ['orderId', 'data.kdsStatus'],
          kdsStatuses: ['acknowledged', 'completed'],
        },
        {
          action: 'update_delivery_status',
          description: 'Update delivery tracking status',
          requiredFields: ['orderId', 'data.deliveryStatus'],
          deliveryStatuses: ['assigned', 'picking_up', 'in_transit', 'arriving', 'delivered'],
        },
        {
          action: 'cancel_order',
          description: 'Cancel an order with optional reason',
          requiredFields: ['orderId'],
          optionalFields: ['data.cancellationReason', 'data.refundAmount'],
        },
      ],
      examplePayload: {
        action: 'send_notification',
        orderId: '507f1f77bcf86cd799439011',
        data: {
          notificationType: 'order_ready',
          channel: 'all',
        },
      },
    },
  });
}

/**
 * Helper function to map status to event type
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