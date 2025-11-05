import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { readLimiter, writeLimiter } from '@/lib/rateLimiter';

// GET - Fetch reviews for a product
export async function GET(request: NextRequest) {
  const rateLimitResponse = await readLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status') || 'approved';
    const sortBy = searchParams.get('sortBy') || 'recent'; // recent, rating, helpful

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID requis' },
        { status: 400 }
      );
    }

    await connectDB();

    // Build query
    const query: any = { product: productId };

    if (status) {
      query.status = status;
    }

    // Build sort
    let sort: any = { createdAt: -1 };
    if (sortBy === 'rating') {
      sort = { rating: -1, createdAt: -1 };
    } else if (sortBy === 'helpful') {
      sort = { helpfulCount: -1, createdAt: -1 };
    }

    const reviews = await Review.find(query)
      .sort(sort)
      .populate('product', 'name image')
      .populate('adminResponse.respondedBy', 'name');

    // Get rating statistics
    const stats = await Review.getProductRating(productId);

    return NextResponse.json({
      reviews,
      stats,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  const rateLimitResponse = await writeLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const {
      productId,
      customerName,
      customerEmail,
      rating,
      title,
      comment,
    } = body;

    // Validation
    if (!productId || !customerName || !customerEmail || !rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      );
    }

    if (comment.length > 1000) {
      return NextResponse.json(
        { error: 'Le commentaire ne peut pas dépasser 1000 caractères' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user can review
    const canReview = await Review.canUserReview(productId, customerEmail);

    if (!canReview.canReview) {
      return NextResponse.json(
        { error: canReview.reason },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      product: productId,
      order: canReview.orderId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.toLowerCase().trim(),
      rating,
      title: title.trim(),
      comment: comment.trim(),
      verified: canReview.verified,
      status: 'pending', // Reviews need approval
    });

    return NextResponse.json(
      {
        message: 'Votre avis a été soumis et sera publié après modération',
        review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating review:', error);

    // Handle duplicate review
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis pour ce produit' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'avis' },
      { status: 500 }
    );
  }
}
