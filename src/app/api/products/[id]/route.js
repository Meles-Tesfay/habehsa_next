import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const body = await request.json();
    if (body.stock !== undefined) {
      const s = Number(body.stock);
      body.status = s === 0 ? 'out' : s <= 5 ? 'low' : 'in';
    }
    const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const deleted = await Product.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
