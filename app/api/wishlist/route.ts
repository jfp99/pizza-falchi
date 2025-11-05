import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { readLimiter, writeLimiter } from '@/lib/rateLimiter';

// GET - Fetch wishlist items
export async function GET(request: NextRequest) {
  const rateLimitResponse = await readLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Try to get session first
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || email;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({ email: userEmail.toLowerCase() })
      .populate('items.product');

    if (!wishlist) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({
      items: wishlist.items,
      totalItems: wishlist.items.length,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la liste' },
      { status: 500 }
    );
  }
}

// POST - Add product to wishlist
export async function POST(request: NextRequest) {
  const rateLimitResponse = await writeLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { productId, email } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID requis' },
        { status: 400 }
      );
    }

    // Try to get session first
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || email;
    const userId = session?.user?.id;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email requis pour ajouter aux favoris' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get or create wishlist
    const wishlist = await Wishlist.getOrCreate(userEmail, userId);

    // Add product
    await wishlist.addProduct(productId);

    return NextResponse.json({
      message: 'Produit ajouté aux favoris',
      totalItems: wishlist.items.length,
    });
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'ajout aux favoris' },
      { status: 500 }
    );
  }
}

// DELETE - Remove all items or clear wishlist
export async function DELETE(request: NextRequest) {
  const rateLimitResponse = await writeLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Try to get session first
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || email;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({ email: userEmail.toLowerCase() });

    if (!wishlist) {
      return NextResponse.json({ message: 'Liste déjà vide' });
    }

    await wishlist.clear();

    return NextResponse.json({ message: 'Liste vidée avec succès' });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return NextResponse.json(
      { error: 'Erreur lors du vidage de la liste' },
      { status: 500 }
    );
  }
}
