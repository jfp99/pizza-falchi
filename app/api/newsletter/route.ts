import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';
import { sendNewsletterWelcomeEmail } from '@/lib/email';
import { validateCSRFMiddleware } from '@/lib/csrf';
import { sanitizeEmail, sanitizeText } from '@/lib/sanitize';
import { newsletterSchema } from '@/lib/validations/newsletter';

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
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json(
      { error: csrfValidation.error },
      { status: 403 }
    );
  }

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

    // Sanitize input
    const sanitizedBody = {
      email: sanitizeEmail(body.email || ''),
      name: body.name ? sanitizeText(body.name) : undefined,
      source: body.source ? sanitizeText(body.source) : 'footer',
      tags: Array.isArray(body.tags) ? body.tags.map((t: string) => sanitizeText(t)) : [],
    };

    // Validate with Zod
    const validationResult = newsletterSchema.safeParse(sanitizedBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Données d\'inscription invalides',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Subscribe or resubscribe
    const result = await Newsletter.subscribe(
      validatedData.email,
      validatedData.name,
      validatedData.source,
      validatedData.tags
    );

    // Send welcome email for new subscribers
    if (result.isNew) {
      try {
        await sendNewsletterWelcomeEmail({
          email: validatedData.email,
          name: validatedData.name,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
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
