import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendOrderStatusEmail } from '@/lib/email';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-09-30.clover',
});

// Webhook secret for signature verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        // Unhandled event type - no action needed
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    await connectDB();

    // Find order by payment intent ID
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order payment status
    order.paymentStatus = 'paid';
    order.status = 'confirmed'; // Auto-confirm paid orders
    await order.save();

    // Send confirmation email to customer
    if (order.email) {
      try {
        const orderId = order._id.toString().slice(-6).toUpperCase();
        await sendOrderStatusEmail({
          orderId,
          customerName: order.customerName,
          customerEmail: order.email,
          status: 'confirmed',
          estimatedTime: order.estimatedDelivery
            ? new Date(order.estimatedDelivery).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : undefined,
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    await connectDB();

    // Find order by payment intent ID
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order payment status
    order.paymentStatus = 'failed';
    // Don't cancel the order - customer might retry
    await order.save();

    // Optionally send failure notification email
    // (You may want to implement this based on business logic)
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle canceled payment
 */
async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    await connectDB();

    // Find order by payment intent ID
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    // Update order payment status
    order.paymentStatus = 'failed';
    order.status = 'cancelled';
    await order.save();

    // Send cancellation email if needed
    if (order.email) {
      try {
        const orderId = order._id.toString().slice(-6).toUpperCase();
        await sendOrderStatusEmail({
          orderId,
          customerName: order.customerName,
          customerEmail: order.email,
          status: 'cancelled',
        });
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError);
      }
    }
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge) {
  try {
    await connectDB();

    // Get payment intent from charge
    const paymentIntentId =
      typeof charge.payment_intent === 'string'
        ? charge.payment_intent
        : charge.payment_intent?.id;

    if (!paymentIntentId) {
      console.error('No payment intent ID in charge');
      return;
    }

    // Find order by payment intent ID
    const order = await Order.findOne({ paymentIntentId });

    if (!order) {
      console.error(`Order not found for payment intent: ${paymentIntentId}`);
      return;
    }

    // Update order payment status
    order.paymentStatus = 'refunded';
    await order.save();

    // Send refund confirmation email
    if (order.email) {
      try {
        // You may want to create a specific refund email template
        const orderId = order._id.toString().slice(-6).toUpperCase();
        await sendOrderStatusEmail({
          orderId,
          customerName: order.customerName,
          customerEmail: order.email,
          status: 'cancelled', // Reuse cancelled template for now
        });
      } catch (emailError) {
        console.error('Error sending refund email:', emailError);
      }
    }
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}

// Disable body parsing for webhook raw body verification
export const runtime = 'nodejs';
