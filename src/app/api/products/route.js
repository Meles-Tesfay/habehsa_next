import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';
export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    if (body.stock !== undefined) {
      const s = Number(body.stock);
      body.status = s === 0 ? 'out' : s <= 5 ? 'low' : 'in';
    }
    const product = new Product(body);
    const newProduct = await product.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
