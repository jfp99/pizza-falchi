import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';
import { writeLimiter } from '@/lib/rateLimiter';

// PUT - Update promo code (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const rateLimitResponse = await writeLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validation
    if (body.validFrom && body.validUntil) {
      const validFrom = new Date(body.validFrom);
      const validUntil = new Date(body.validUntil);

      if (validUntil <= validFrom) {
        return NextResponse.json(
          { error: 'La date de fin doit être après la date de début' },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Await params in Next.js 15
    const { id } = await params;

    // Check if code exists (if code is being changed)
    if (body.code) {
      const existing = await PromoCode.findOne({
        code: body.code.toUpperCase().trim(),
        _id: { $ne: id },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Ce code promo existe déjà' },
          { status: 400 }
        );
      }
    }

    // Update promo code
    const promoCode = await PromoCode.findByIdAndUpdate(
      id,
      {
        ...body,
        code: body.code ? body.code.toUpperCase().trim() : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Code promo non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(promoCode);
  } catch (error: any) {
    console.error('Error updating promo code:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour du code promo' },
      { status: 500 }
    );
  }
}

// DELETE - Delete promo code (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply rate limiting
  const rateLimitResponse = await writeLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();

    // Await params in Next.js 15
    const { id } = await params;

    const promoCode = await PromoCode.findByIdAndDelete(id);

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Code promo non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Code promo supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du code promo' },
      { status: 500 }
    );
  }
}
