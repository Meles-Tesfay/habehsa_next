'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlist, setCartOpen } = useShop();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/account');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (isDashboard) return null;

  const handleUserClick = () => {
    if (!user) router.push('/login');
    else if (user.role === 'admin') router.push('/dashboard');
    else router.push('/account');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <Link href="/" className="navbar-logo" aria-label="Habesha Heritage Home">
          Habesha Heritage.
        </Link>

        <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <a href="/#main-content" onClick={() => setMobileOpen(false)}>Home</a>
          <a href="/#collections" onClick={() => setMobileOpen(false)}>Shop</a>
          <a href="/#arrivals" onClick={() => setMobileOpen(false)}>New Arrivals</a>
          <a href="/#story" onClick={() => setMobileOpen(false)}>Story</a>
          <a href="/#reviews" onClick={() => setMobileOpen(false)}>Reviews</a>
          {user?.role === 'admin' ? (
            <Link href="/dashboard" className="sell-btn" onClick={() => setMobileOpen(false)}>Seller Dashboard</Link>
          ) : user ? (
            <Link href="/account" className="sell-btn" onClick={() => setMobileOpen(false)}>My Account</Link>
          ) : (
            <Link href="/login" className="sell-btn" onClick={() => setMobileOpen(false)}>Sign In</Link>
          )}
          
          <div className="mobile-only-links">
            <a href="#" onClick={(e) => { e.preventDefault(); handleUserClick(); }}>
              <User size={18} /> Account
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); /* trigger wishlist if possible, else just link */ }}>
              <Heart size={18} /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </a>
          </div>
        </div>

        <div className="nav-actions">
          <button className="nav-icon-btn hide-on-mobile" aria-label="Account" onClick={handleUserClick}>
            <User size={20} strokeWidth={1.5} />
          </button>
          <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="nav-icon-btn hide-on-mobile" aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
            {wishlist.length > 0 && <span className="badge blue-badge">{wishlist.length}</span>}
          </button>
          <button className="nav-icon-btn" onClick={() => setCartOpen(true)} aria-label={`Shopping cart, ${cartCount} items`}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && <span className="badge blue-badge">{cartCount}</span>}
          </button>
          <button className="nav-icon-btn mobile-menu-btn" aria-hidden onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`search-overlay ${searchOpen ? 'active' : ''}`}
        role="dialog"
        aria-label="Search"
        onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
      >
        <div className="search-box">
          <div className="search-input-wrap">
            <Search size={20} color="var(--muted)" />
            <input type="search" placeholder="Search for kemis, suits, accessories..." autoFocus={searchOpen} aria-label="Search products" />
            <button className="search-close" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={20} /></button>
          </div>
          <div className="search-pills">
            <span>Popular:</span>
            {['Bridal Kemis', 'Gold Tilet', "Men's Traditional", 'Accessories', 'Family Sets'].map(t => (
              <a key={t} href="/#collections" className="search-pill" onClick={() => setSearchOpen(false)}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
