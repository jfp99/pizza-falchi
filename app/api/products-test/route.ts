import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    console.log('[products-test] Starting...');
    await connectDB();
    console.log('[products-test] Connected to DB');
    const products = await Product.find({ available: true }).limit(5);
    console.log(`[products-test] Found ${products.length} products`);
    return NextResponse.json({ count: products.length, products });
  } catch (error) {
    console.error('[products-test] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
