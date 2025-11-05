import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';
import { readLimiter } from '@/lib/rateLimiter';

interface ValidatePromoCodeRequest {
  code: string;
  subtotal: number;
  items: Array<{
    product: {
      _id: string;
      name: string;
      category: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  customerEmail?: string;
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await readLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: ValidatePromoCodeRequest = await request.json();
    const { code, subtotal, items, customerEmail } = body;

    // Validation
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Code promo requis' },
        { status: 400 }
      );
    }

    if (!subtotal || typeof subtotal !== 'number' || subtotal <= 0) {
      return NextResponse.json(
        { valid: false, message: 'Montant de commande invalide' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { valid: false, message: 'Panier vide' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find promo code
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase().trim(),
    });

    if (!promoCode) {
      return NextResponse.json(
        { valid: false, message: 'Code promo invalide' },
        { status: 404 }
      );
    }

    // Check if promo can be used by customer
    const usageCheck = await promoCode.canBeUsedBy(customerEmail || '');
    if (!usageCheck.valid) {
      return NextResponse.json(
        { valid: false, message: usageCheck.message },
        { status: 400 }
      );
    }

    // Calculate discount
    const discountResult = promoCode.calculateDiscount(subtotal, items);

    if (!discountResult.valid) {
      return NextResponse.json(
        { valid: false, message: discountResult.message },
        { status: 400 }
      );
    }

    // Return successful validation
    return NextResponse.json({
      valid: true,
      promoCode: {
        code: promoCode.code,
        description: promoCode.description,
        type: promoCode.type,
        discount: discountResult.discount,
        applicableSubtotal: discountResult.applicableSubtotal,
      },
      message: `Code promo appliqué ! -${discountResult.discount.toFixed(2)}€`,
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json(
      { valid: false, message: 'Erreur lors de la validation du code promo' },
      { status: 500 }
    );
  }
}
