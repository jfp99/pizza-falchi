import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AbandonedCart from '@/models/AbandonedCart';

/**
 * Mark abandoned carts as converted when a user completes checkout
 * POST /api/abandoned-cart/convert
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Mark all pending/reminded carts for this email as converted
    const result = await AbandonedCart.markAsConverted(email);

    return NextResponse.json({
      success: true,
      message: 'Carts marked as converted',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Abandoned cart conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to mark cart as converted' },
      { status: 500 }
    );
  }
}
