import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';
export async function GET() {
  await dbConnect();
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const { customerName, customerEmail, phone, address, items, amount } = await request.json();
    const orderId = 'HH-' + Math.floor(1000 + Math.random() * 9000);
    const order = new Order({ orderId, customerName, customerEmail, phone, address, items, amount, status: 'pending' });
    const newOrder = await order.save();
    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
