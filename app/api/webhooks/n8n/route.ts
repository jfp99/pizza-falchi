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
        // Mark notification as sent
        if (data.channel === 'whatsapp') {
          order.notificationSent = true;
          order.notificationChannels = {
            ...order.notificationChannels,
            whatsapp: true,
          };
        } else if (data.channel === 'email') {
          order.notificationChannels = {
            ...order.notificationChannels,
            email: true,
          };
        }

        order.lastNotificationTime = new Date();
        await order.save();

        result = {
          orderId: order._id,
          orderNumber: order.orderId,
          notificationType: data.notificationType,
          channel: data.channel,
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
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'n8n webhook endpoint is active',
    version: '1.0',
    timestamp: new Date().toISOString(),
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