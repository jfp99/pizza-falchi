import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { validateCSRFMiddleware } from '@/lib/csrf';
import { dispatchOrderStatusChanged } from '@/lib/webhooks/dispatcher';
import { webhookEvents, getEventTypeForOrderStatus } from '@/lib/webhooks/events';
import { sendOrderStatusEmail } from '@/lib/email';
import { sendOrderReadyNotification } from '@/lib/whatsapp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const order = await Order.findById(id).populate('items.product');

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json({ error: csrfValidation.error }, { status: 403 });
  }

  try {
    await connectDB();
    const { id } = await params;

    const body = await request.json();

    // Get the current order to track status changes
    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    const previousStatus = currentOrder.status;
    const hasStatusChanged = body.status && body.status !== previousStatus;

    // Update the order
    const order = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('items.product');

    // If status changed, emit webhook event and send notifications
    if (hasStatusChanged) {
      // 1. Dispatch webhook to n8n (primary automation)
      try {
        await dispatchOrderStatusChanged(order, previousStatus, body.status);

        // Emit via event system for local listeners
        const eventType = getEventTypeForOrderStatus(body.status);
        if (eventType) {
          await webhookEvents.emitOrderStatusChanged(eventType, {
            orderId: order._id.toString(),
            orderNumber: order.orderId || order._id.toString().slice(-6).toUpperCase(),
            previousStatus,
            newStatus: body.status,
            customer: {
              name: order.customerName,
              email: order.email,
              phone: order.phone,
              deliveryAddress: order.deliveryAddress,
            },
          });
        }

        // Log webhook event in order document
        await Order.findByIdAndUpdate(id, {
          $push: {
            webhookEvents: {
              eventType: `order.${body.status}`,
              timestamp: new Date(),
              success: true,
              retries: 0,
            },
          },
        });
      } catch (webhookError) {
        console.error('Webhook dispatch error:', webhookError);
        // Log failed webhook event
        await Order.findByIdAndUpdate(id, {
          $push: {
            webhookEvents: {
              eventType: `order.${body.status}`,
              timestamp: new Date(),
              success: false,
              retries: 0,
              error: webhookError instanceof Error ? webhookError.message : 'Unknown error',
            },
          },
        });
      }

      // 2. Send customer notifications (fallback/complement to n8n)
      // These are fire-and-forget to not block the API response
      const notificationPromises: Promise<any>[] = [];

      // Send email notification to customer (if email provided)
      if (order.email && ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'].includes(body.status)) {
        notificationPromises.push(
          sendOrderStatusEmail({
            orderId: order.orderId || order._id.toString().slice(-6).toUpperCase(),
            customerName: order.customerName,
            customerEmail: order.email,
            status: body.status as 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled',
            estimatedTime: order.estimatedDelivery
              ? new Date(order.estimatedDelivery).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              : undefined,
            trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://pizzafalchi.com'}/order-confirmation/${order._id}`,
          })
            .then(result => {
              if (result.success) {
                console.log(`Status update email (${body.status}) sent to ${order.email}`);
              } else {
                console.warn(`Failed to send status email: ${result.error}`);
              }
            })
            .catch(err => console.error('Status email error:', err))
        );
      }

      // Send WhatsApp notification when order is ready (high priority)
      if (body.status === 'ready' && order.phone) {
        notificationPromises.push(
          sendOrderReadyNotification({
            orderId: order.orderId || order._id.toString().slice(-6).toUpperCase(),
            customerName: order.customerName,
            customerPhone: order.phone,
            deliveryType: order.deliveryType,
          })
            .then(result => {
              if (result.success) {
                console.log(`Order ready WhatsApp sent to ${order.phone}`);
              } else {
                console.warn(`Failed to send order ready WhatsApp: ${result.error}`);
              }
            })
            .catch(err => console.error('Order ready WhatsApp error:', err))
        );
      }

      // Wait for notifications with timeout (don't block response)
      if (notificationPromises.length > 0) {
        Promise.race([
          Promise.allSettled(notificationPromises),
          new Promise(resolve => setTimeout(resolve, 2000)) // 2 second timeout
        ]).catch(err => console.error('Notification batch error:', err));
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json({ error: csrfValidation.error }, { status: 403 });
  }

  try {
    await connectDB();
    const { id } = await params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la commande' },
      { status: 500 }
    );
  }
}
