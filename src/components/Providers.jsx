'use client';

import { ShopProvider } from '@/context/ShopContext';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ShopProvider>
        {children}
      </ShopProvider>
    </AuthProvider>
  );
}
