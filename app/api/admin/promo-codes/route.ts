import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';
import { writeLimiter } from '@/lib/rateLimiter';

// GET - List all promo codes (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();

    const promoCodes = await PromoCode.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    return NextResponse.json(promoCodes);
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des codes promo' },
      { status: 500 }
    );
  }
}

// POST - Create new promo code (Admin only)
export async function POST(request: NextRequest) {
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
    if (!body.code || !body.description || !body.type || body.value === undefined) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    if (!body.validFrom || !body.validUntil) {
      return NextResponse.json(
        { error: 'Les dates de validité sont requises' },
        { status: 400 }
      );
    }

    const validFrom = new Date(body.validFrom);
    const validUntil = new Date(body.validUntil);

    if (validUntil <= validFrom) {
      return NextResponse.json(
        { error: 'La date de fin doit être après la date de début' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if code already exists
    const existing = await PromoCode.findOne({
      code: body.code.toUpperCase().trim(),
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ce code promo existe déjà' },
        { status: 400 }
      );
    }

    // Create promo code
    const promoCode = await PromoCode.create({
      code: body.code.toUpperCase().trim(),
      description: body.description,
      type: body.type,
      value: body.value,
      minOrderAmount: body.minOrderAmount || undefined,
      maxDiscount: body.maxDiscount || undefined,
      usageLimit: body.usageLimit || undefined,
      usagePerCustomer: body.usagePerCustomer || 1,
      validFrom,
      validUntil,
      isActive: body.isActive !== undefined ? body.isActive : true,
      applicableCategories: body.applicableCategories || [],
      excludedProducts: body.excludedProducts || [],
      createdBy: session.user.id,
    });

    return NextResponse.json(promoCode, { status: 201 });
  } catch (error: any) {
    console.error('Error creating promo code:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du code promo' },
      { status: 500 }
    );
  }
}
