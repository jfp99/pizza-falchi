import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    // Use lean() to return plain JavaScript objects instead of Mongoose documents (faster)
    // Select only necessary fields to reduce payload size
    const products = await Product.find({ available: true })
      .select('_id name description price category image ingredients customizable popular spicy vegetarian tags sizeOptions availableExtras available')
      .sort({ category: 1, name: 1 })
      .lean()
      .exec();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors du chargement des produits',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
