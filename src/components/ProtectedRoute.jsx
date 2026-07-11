'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        if (user.role === 'admin') router.replace('/dashboard');
        else if (user.role === 'customer') router.replace('/account');
        else router.replace('/');
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="pf-spinner" /></div>;
  }

  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return children;
};

export default ProtectedRoute;
