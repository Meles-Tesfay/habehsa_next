import React from 'react';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Toast from '@/components/Toast';

export const metadata = {
  title: 'Habesha Heritage | Premium Ethiopian Clothing',
  description: 'Discover our exclusive collection of premium Habesha Kemis and traditional wear, handwoven by master artisans in Addis Ababa.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&family=Nunito:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <CartDrawer />
          <Toast />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
