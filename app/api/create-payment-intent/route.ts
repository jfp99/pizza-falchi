import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validateCSRFMiddleware } from '@/lib/csrf';

// Lazy initialization - only create Stripe instance when needed
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || secretKey === 'your_stripe_secret_key_here') {
    return null;
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-09-30.clover',
  });
};

export async function POST(request: NextRequest) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json(
      { error: csrfValidation.error },
      { status: 403 }
    );
  }

  try {
    // Check if Stripe is configured
    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json(
        { error: 'Online payments are not configured. Please use cash or card on delivery.' },
        { status: 503 }
      );
    }

    const { amount, currency = 'eur' } = await request.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
