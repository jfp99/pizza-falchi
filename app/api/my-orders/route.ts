import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { readLimiter } from '@/lib/rateLimiter';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await readLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Get session to identify user
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user email or phone from session
    const userEmail = session.user.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email utilisateur non trouvé' },
        { status: 400 }
      );
    }

    // Find all orders for this user (by email)
    const orders = await Order.find({ email: userEmail })
      .populate('items.product')
      .populate('timeSlot')
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50); // Limit to last 50 orders

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
