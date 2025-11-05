import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import { writeLimiter } from '@/lib/rateLimiter';

// POST - Mark review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = await writeLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    await connectDB();

    const { id } = await params;
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Avis non trouvé' },
        { status: 404 }
      );
    }

    // Increment helpful count
    review.helpfulCount += 1;
    await review.save();

    return NextResponse.json({
      message: 'Merci pour votre retour !',
      helpfulCount: review.helpfulCount,
    });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
