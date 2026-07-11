import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { status } = await request.json();
    const updated = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
    if (!updated) return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
