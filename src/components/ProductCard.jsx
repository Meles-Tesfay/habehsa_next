'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { useAuth } from '@/context/AuthContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/utils/helpers';

const BADGE_LABELS = {
  bestseller: 'Bestseller',
  new: 'New',
  sale: 'Sale',
};

const ProductCard = ({ product, onQuickView }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { wishlist, toggleWishlist, addToCart, showToast } = useShop();
  const isWishlisted = wishlist.includes(product.id || product._id);
  const [selectedColor, setSelectedColor] = useState(0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      showToast("Please login to buy", "error");
      router.push('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/product/${product.id || product._id}`} className="product-img-wrap" style={{ display: 'block' }}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          onError={e => { e.target.style.opacity = 0; }}
        />

        {product.badge && (
          <span className={`product-badge badge-${product.badge}`}>
            {BADGE_LABELS[product.badge]}
          </span>
        )}

        <button
          className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id || product._id); }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        <div className="product-hover-overlay">
          <button
            className="product-quick-view"
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
          >
            Quick View
          </button>
          <button
            className="product-cart-btn-img"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <ShoppingBag size={17} />
          </button>
        </div>
      </Link>

      <div className="product-info" style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link href={`/product/${product.id || product._id}`}>
          <h3 className="product-name" style={{ fontSize: '14px', lineHeight: '1.4', marginBottom: '6px' }}>{product.name}</h3>
        </Link>
        
        <p className="product-desc" style={{ fontSize: '12px', color: '#666', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description || 'Experience the elegance of traditional craftsmanship with this exquisite piece.'}
        </p>

        <div className="product-meta" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '16px', marginTop: 'auto' }}>
          <div className="product-price" style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>
            {product.oldPrice && <span className="price-old" style={{ textDecoration: 'line-through', color: '#999', fontSize: '13px', marginRight: '8px', fontWeight: '400' }}>${product.oldPrice}</span>}
            ${product.price}
          </div>
          <span style={{ background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Free Shipping</span>
        </div>

        <Link 
          href={`/product/${product.id || product._id}`} 
          className="btn-primary" 
          style={{ display: 'block', width: '100%', textAlign: 'center', padding: '10px 0', fontSize: '14px', borderRadius: '4px' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
