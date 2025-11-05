import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import { readLimiter } from '@/lib/rateLimiter';

// GET - Check if user can review a product
export async function GET(request: NextRequest) {
  const rateLimitResponse = await readLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const customerEmail = searchParams.get('email');

    if (!productId || !customerEmail) {
      return NextResponse.json(
        { error: 'Product ID et email requis' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Review.canUserReview(productId, customerEmail);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
