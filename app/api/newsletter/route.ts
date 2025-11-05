import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';
import { newsletterSignup } from '@/lib/gtag';
import { sendNewsletterWelcomeEmail } from '@/lib/email';

// Rate limiting map
const subscriptionAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = subscriptionAttempts.get(ip);

  if (!attempts || now > attempts.resetAt) {
    subscriptionAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempts.count++;
  return true;
}

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { email, name, source = 'footer', tags = [] } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Subscribe or resubscribe
    const result = await Newsletter.subscribe(email, name, source, tags);

    // Send welcome email for new subscribers
    if (result.isNew) {
      try {
        await sendNewsletterWelcomeEmail({
          email,
          name,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    }

    // Track with Google Analytics
    if (typeof window !== 'undefined') {
      newsletterSignup(source);
    }

    return NextResponse.json(
      {
        message: result.isNew
          ? 'Successfully subscribed to newsletter!'
          : 'You are already subscribed to our newsletter.',
        isNew: result.isNew,
        subscriber: {
          email: result.subscriber.email,
          name: result.subscriber.name,
          status: result.subscriber.status,
        },
      },
      { status: result.isNew ? 201 : 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

// GET /api/newsletter - Get newsletter stats (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin
    // For now, this is a public endpoint for stats

    await connectDB();

    const stats = await Newsletter.getStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Newsletter stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter stats' },
      { status: 500 }
    );
  }
}
