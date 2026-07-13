'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Globe, Clock, Shield, Headphones, Star, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import QuickView from '@/components/QuickView';
import AiAssistant from '@/components/AiAssistant';
import { TESTIMONIALS } from '@/data';
import { useShop } from '@/context/ShopContext';
import Link from 'next/link';

const ScrollArrow = ({ dir, containerId }) => {
  const scroll = () => {
    const el = document.getElementById(containerId);
    if (el) el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };
  return (
    <button
      onClick={scroll}
      aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: 'var(--white)', border: '1.5px solid var(--cream-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--charcoal)',
        transition: 'all .2s', flexShrink: 0,
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--charcoal)'; e.currentTarget.style.color = 'var(--white)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--charcoal)'; }}
    >
      {dir === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
};

const COLLECTIONS = [
  { label: "Women's", name: "Habesha Kemis", img: '/assets/hero_model.png' },
  { label: "Men's", name: "Traditional Suits", img: '/assets/mens_outfit.png' },
  { label: "Bridal", name: "Wedding Collection", img: '/assets/wedding.png' },
  { label: "Artisan", name: "Handmade Accessories", img: '/assets/accessories.png' },
];

const TREND_TABS = ["All", "Women's", "Men's", 'Bridal', 'Accessories', "Children's"];

export default function Home() {
  const { products } = useShop();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [trendTab, setTrendTab] = useState(0);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    '/assets/hero_model.png',
    '/assets/wedding.png',
    '/assets/children.png',
    '/assets/mens_outfit.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.animate-fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const CATEGORY_MAP = {
    "All": null,
    "Women's": ["Women's Kemis", "Women's"],
    "Men's": ["Men's Traditional", "Men's"],
    "Bridal": ["Bridal Collection", "Bridal"],
    "Accessories": ["Accessories"],
    "Children's": ["Children's Wear", "Children's"],
  };

  const activeTab = TREND_TABS[trendTab];
  const activeCategories = CATEGORY_MAP[activeTab];
  const trendProducts = products
    .filter(p => {
      if (!activeCategories) return true; // "All"
      return activeCategories.some(cat =>
        p.category?.toLowerCase().includes(cat.toLowerCase())
      );
    })
    .slice(0, 8);

  return (
    <main id="main-content">
      <section className="hero" aria-label="Hero">
        <div className="hero-background">
          <div style={{ 
            display: 'flex', 
            width: '100%', 
            height: '100%', 
            transition: 'transform 0.8s ease-in-out', 
            transform: `translateX(-${currentImageIndex * 100}%)` 
          }}>
            {heroImages.map((img, idx) => (
              <div key={img} style={{ width: '100%', height: '100%', flexShrink: 0, position: 'relative' }}>
                <img
                  src={img}
                  alt={`Hero model ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-content">
          <span className="hero-eyebrow">Authentic · Handcrafted · Premium</span>
          <h1 className="hero-title">
            The Essence of<br /><em>Ethiopian</em> Elegance
          </h1>
          <p className="hero-desc">
            Discover our exclusive collection of premium Habesha Kemis and traditional wear,
            handwoven by master artisans in Addis Ababa — now shipping to 60+ countries.
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-gold" onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}>
              Shop the Collection
            </button>
            <button className="btn-primary btn-outline" style={{ color: 'var(--white)', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse All
            </button>
          </div>
          <div className="hero-stats">
            {[
              { num: '500+', label: 'Artisan Partners' },
              { num: '10k+', label: 'Orders Delivered' },
              { num: '60+', label: 'Countries Shipped' },
            ].map(s => (
              <div key={s.label} className="hero-stat-item">
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="trust-strip">
        {[
          { icon: Globe, text: 'Ships to 60+ Countries' },
          { icon: Clock, text: '7–14 Day Artisan Crafting' },
          { icon: Shield, text: '100% Authentic & Handmade' },
          { icon: Headphones, text: '24/7 Customer Support' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="trust-item">
            <Icon size={15} />
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Collections overview grid */}
      <section id="collections" className="section">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Browse</div>
            <h2 className="section-title">Shop by Collection</h2>
            <p className="section-subtitle">
              From everyday elegance to ceremonial grandeur — discover curated lines for every occasion.
            </p>
          </div>
          <a href="#shop" className="link-all" onClick={(e) => { e.preventDefault(); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}>
            View All <ChevronRight size={15} />
          </a>
        </div>

        <div className="collection-grid animate-fade-up">
          {COLLECTIONS.map((col, i) => (
            <div key={i} className="collection-card">
              <img src={col.img} alt={col.name} loading="lazy" />
              <div className="collection-card-overlay">
                <div className="collection-card-label">{col.label}</div>
                <div className="collection-card-name">{col.name}</div>
                <button 
                  className="collection-card-btn" 
                  onClick={() => {
                    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                    setTrendTab(i + 1); // +1 because index 0 = "All"
                  }}
                >
                  Shop Now <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bridal feature banner */}
      <section className="wedding-banner" aria-label="Bridal Collection">
        <img src="/assets/wedding.png" alt="Ethiopian Bridal Kemis" />
        <div className="wedding-banner-content">
          <div className="wedding-banner-eyebrow">✦ Limited Bridal Collection ✦</div>
          <h2 className="wedding-banner-title">Your Perfect<br />Wedding Kemis</h2>
          <p className="wedding-banner-subtitle">
            Bespoke, handcrafted bridal Habesha Kemis made to your exact measurements.
            Every stitch tells a story of love and heritage. Walk down the aisle draped
            in the finest Ethiopian silk tilet — a garment as unique as your love story.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn-primary btn-gold"
              onClick={() => {
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                setTrendTab(TREND_TABS.indexOf('Bridal'));
              }}
            >
              Explore Bridal
            </button>
            <button
              className="btn-primary"
              style={{ background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.3)', backdropFilter: 'blur(8px)' }}
              onClick={() => setAiOpen(true)}
            >
              Custom Tailoring
            </button>
          </div>
        </div>
      </section>

      {/* Unified product section with category tabs */}
      <section id="shop" className="section section-cream">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Our Collection</div>
            <h2 className="section-title">Find Your Style</h2>
            <p className="section-subtitle">
              Browse our full range of authentic Ethiopian clothing — filter by category to find exactly what you're looking for.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ScrollArrow dir="left" containerId="shop-scroll" />
            <ScrollArrow dir="right" containerId="shop-scroll" />
          </div>
        </div>

        <div className="tab-bar">
          {TREND_TABS.map((t, i) => (
            <button
              key={t}
              className={`tab-btn ${trendTab === i ? 'active' : ''}`}
              onClick={() => setTrendTab(i)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="products-scroll" id="shop-scroll">
          {trendProducts.map(p => (
            <ProductCard key={p.id || p._id} product={p} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section id="story" className="section">
        <div className="story-layout animate-fade-up">
          <div className="story-imgs">
            <img src="/assets/mens_outfit.png" alt="Ethiopian artisan" className="story-img-main" loading="lazy" />
            <img src="/assets/fabric_texture.png" alt="Handwoven Tilet fabric" className="story-img-inset" loading="lazy" />
          </div>
          <div className="story-text">
            <div className="section-eyebrow">Our Heritage</div>
            <h2 className="section-title" style={{ marginBottom: 24 }}>Handcrafted with<br />Ancient Traditions</h2>
            <p>
              For centuries, Ethiopian weavers have created some of the world's most intricate textiles. The art of Tilet — the hand-embroidered geometric patterns that adorn every Habesha Kemis — is passed down from mother to daughter across generations.
            </p>
            <p>
              At Habesha Heritage, we partner directly with over 500 master artisans across Addis Ababa, Gondar, Lalibela, and Axum, ensuring fair wages and preserving these ancient techniques for the world to cherish.
            </p>
            <p style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--muted)', borderLeft: '3px solid var(--gold)', paddingLeft: 16, marginTop: 4 }}>
              "Every thread woven is a prayer, a memory, and a promise passed to the next generation." — Tigist Alemu, Master Weaver, Addis Ababa
            </p>
            <div className="story-pillars">
              {[
                { icon: '✦', title: 'Master Artisans', desc: 'Each piece is handcrafted by certified artisan partners' },
                { icon: '♻', title: 'Sustainable', desc: '100% natural, hand-dyed Ethiopian cotton' },
                { icon: '🌍', title: 'Global Reach', desc: 'Shipped to 60+ countries worldwide' },
                { icon: '💛', title: 'Fair Trade', desc: 'Directly supporting Ethiopian craftspeople' },
              ].map(p => (
                <div key={p.title} className="story-pillar">
                  <div className="story-pillar-icon">{p.icon}</div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section section-cream" id="reviews">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Customer Love</div>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">
              Real stories from real people across the globe — from the Ethiopian diaspora in Washington DC to families celebrating weddings in London and Sydney.
            </p>
          </div>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="testimonial-card animate-fade-up">
              <div className="testimonial-stars">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div
                  className="testimonial-avatar"
                  style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: 'white',
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-location">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / Why us */}
      <section className="section shipping-section">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div>
            <div className="section-eyebrow" style={{ color: 'var(--gold-light)' }}>Our Promise</div>
            <h2 className="section-title">Why Shop with Us</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,.5)' }}>
              We have spent years perfecting our delivery and quality promise so you can shop with complete confidence — wherever in the world you call home.
            </p>
          </div>
        </div>
        <div className="shipping-grid">
          {[
            { icon: Globe, title: '60+ Countries', desc: 'We ship authentic Ethiopian clothing worldwide, to every corner of the diaspora.' },
            { icon: Shield, title: 'Quality Guaranteed', desc: 'Every piece undergoes strict quality checks before leaving our artisan workshops.' },
            { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is always available to assist with sizing, customs, and care.' },
            { icon: RotateCcwIcon, title: 'Easy Returns', desc: '30-day hassle-free returns on all standard orders. Custom pieces are final sale.' },
          ].map(({ icon: Icon, ...item }) => (
            <div key={item.title} className="shipping-item animate-fade-up">
              <div className="shipping-icon"><Icon size={28} /></div>
              <div className="shipping-title">{item.title}</div>
              <p className="shipping-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="section-eyebrow" style={{ justifyContent: 'center', marginBottom: 12 }}>Stay Connected</div>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 12 }}>Join 25,000+ Fashion Lovers</h2>
        <p style={{ color: 'var(--warm-gray)', fontSize: 15, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          Get early access to new collections, exclusive discounts, artisan stories, and seasonal style guides straight to your inbox — curated just for you.
        </p>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.querySelector('input');
            if (input) input.value = '';
            alert('Thank you for subscribing! 🎉');
          }}
        >
          <input type="email" placeholder="Enter your email address" required aria-label="Email for newsletter" />
          <button type="submit" className="btn-primary btn-gold">Subscribe</button>
        </form>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, textAlign: 'center' }}>
          No spam. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
        </p>
      </section>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
      <AiAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </main>
  );
}

const RotateCcwIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
  </svg>
);
