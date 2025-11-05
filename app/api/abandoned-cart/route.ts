import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AbandonedCart from '@/models/AbandonedCart';

// POST /api/abandoned-cart - Save abandoned cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, items, customerName } = body;

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart items are required' },
        { status: 400 }
      );
    }

    // Save abandoned cart
    const cart = await AbandonedCart.saveCart(email, items, customerName);

    return NextResponse.json({
      message: 'Cart saved successfully',
      cartId: cart._id,
    });
  } catch (error) {
    console.error('Abandoned cart save error:', error);
    return NextResponse.json(
      { error: 'Failed to save abandoned cart' },
      { status: 500 }
    );
  }
}

// GET /api/abandoned-cart - Get abandoned cart stats (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin
    await connectDB();

    const stats = await AbandonedCart.getStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Abandoned cart stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned cart stats' },
      { status: 500 }
    );
  }
}
