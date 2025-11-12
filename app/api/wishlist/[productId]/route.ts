import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { writeLimiter } from '@/lib/rateLimiter';
import { validateCSRFMiddleware } from '@/lib/csrf';

// DELETE - Remove specific product from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json({ error: csrfValidation.error }, { status: 403 });
  }

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
      return NextResponse.json(
        { error: 'Liste non trouvée' },
        { status: 404 }
      );
    }

    const { productId } = await params;
    await wishlist.removeProduct(productId);

    return NextResponse.json({
      message: 'Produit retiré des favoris',
      totalItems: wishlist.items.length,
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Erreur lors du retrait du produit' },
      { status: 500 }
    );
  }
}
