import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();
  if (email === 'admin@habesha.com' && password === 'admin') {
    return NextResponse.json({
      token: 'mock-jwt-token-admin',
      user: { name: 'Tigist Haile', role: 'admin', email },
    });
  } else if (email === 'customer@example.com' && password === 'password') {
    return NextResponse.json({
      token: 'mock-jwt-token-cust',
      user: { name: 'Abeba Alemu', role: 'customer', email },
    });
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}
