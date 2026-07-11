'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const OrderConfirmationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Invalid Order</h2>
        <button className="btn-primary" onClick={() => router.push('/')} style={{ marginTop: 24 }}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <CheckCircle size={64} color="var(--success, #10B981)" style={{ marginBottom: 24 }} />
      <h1 className="heading-1" style={{ marginBottom: 16 }}>Order Confirmed!</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--warm-gray)', marginBottom: 32 }}>
        Thank you for your purchase. Your order ID is <strong>{orderId}</strong>.
      </p>
      <p style={{ marginBottom: 32, maxWidth: 500 }}>
        We have received your order and are currently processing it. 
        You will receive an email confirmation shortly.
      </p>
      
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href="/" className="btn-primary btn-outline">
          Continue Shopping
        </Link>
        <Link href="/account" className="btn-primary">
          View My Orders
        </Link>
      </div>
    </div>
  );
};

const OrderConfirmation = () => {
  return (
    <Suspense fallback={<div className="section" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><div className="pf-spinner" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
};

export default OrderConfirmation;
