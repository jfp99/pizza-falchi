import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

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

    // Unsubscribe
    try {
      await Newsletter.unsubscribe(email);
      return NextResponse.json({
        message: 'Successfully unsubscribed from newsletter.',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Subscriber not found') {
        return NextResponse.json(
          { error: 'Email not found in our newsletter list' },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}
