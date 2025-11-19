import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readLimiter, apiLimiter } from '@/lib/rateLimiter';
import { productSchema } from '@/lib/validations/product';
import { validateCSRFMiddleware } from '@/lib/csrf';
import { sanitizeProductData } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting for read operations
    const rateLimitResponse = await readLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    await connectDB();
    const products = await Product.find({ available: true }).sort({ category: 1, name: 1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return detailed error in production for debugging
    return NextResponse.json(
      {
        error: 'Erreur lors du chargement des produits',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV !== 'production' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply CSRF protection
  const csrfValidation = await validateCSRFMiddleware(request);
  if (!csrfValidation.valid) {
    return NextResponse.json(
      { error: csrfValidation.error },
      { status: 403 }
    );
  }

  // Apply rate limiting for product creation
  const rateLimitResponse = await apiLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    // Sanitize input to prevent XSS attacks
    const sanitizedBody = sanitizeProductData(body);

    // Validate input with Zod
    const validationResult = productSchema.safeParse(sanitizedBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Données de produit invalides',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    const product = await Product.create(validatedData);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}