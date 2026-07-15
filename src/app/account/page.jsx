'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import {
  LogOut, Package, Heart, MapPin, Bell, User, Ruler, RotateCcw,
  Truck, Settings, ChevronRight, ShoppingBag, TrendingUp, Star,
  Clock, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';   
import ProductCard from '@/components/ProductCard';

const STATUS_CONFIG = {
  delivered:  { label: 'Delivered',  color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  Icon: CheckCircle2 },
  shipped:    { label: 'Shipped',    color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)',  Icon: Truck        },
  processing: { label: 'Processing', color: '#b45309', bg: 'rgba(180,83,9,0.08)',   Icon: RefreshCw    },
  pending:    { label: 'Pending',    color: '#dc2626', bg: 'rgba(220,38,38,0.08)',  Icon: Clock        },
};

const StatusPill = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.Icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
      color: cfg.color, background: cfg.bg, letterSpacing: '0.02em'
    }}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
};

const OrderCard = ({ order }) => (
  <div className="cdp-order-card">
    <div className="cdp-order-head">
      <div>
        <span className="cdp-order-id">{order.orderId}</span>
        <span className="cdp-order-date">
          {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="cdp-order-amount">${(order.amount || 0).toFixed(2)}</span>
        <StatusPill status={order.status} />
      </div>
    </div>
    {order.items && order.items.length > 0 && (
      <div className="cdp-order-items-row">
        {order.items.slice(0, 3).map((item, idx) => (
          <div key={idx} className="cdp-order-item">
            <img
              src={item.image ? (item.image.startsWith('http') ? item.image : `/assets/${item.image}`) : '/assets/hero_model.png'}
              alt={item.name}
            />
            <div className="cdp-order-item-info">
              <div className="cdp-order-item-name">{item.name}</div>
              <div className="cdp-order-item-meta">Qty {item.quantity} &middot; ${item.price?.toFixed(2)}</div>
            </div>
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="cdp-order-more">+{order.items.length - 3} more</div>
        )}
      </div>
    )}
  </div>
);

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { products, wishlist } = useShop();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(data.filter(order => order.customerEmail === user.email));
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));
    } else {
      setLoadingOrders(false);
    }
  }, [user]);

  const wishlistItems = products.filter(p => wishlist.includes(p.id) || wishlist.includes(p._id));
  const activeOrder = orders.find(o => o.status !== 'delivered');
  const totalSpent = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  const tabs = [
    { id: 'overview',      label: 'Overview',          icon: TrendingUp },
    { id: 'orders',        label: 'My Orders',          icon: Package    },
    { id: 'tracking',      label: 'Order Tracking',     icon: Truck      },
    { id: 'wishlist',      label: 'Wishlist',           icon: Heart,  badge: wishlistItems.length },
    { id: 'measurements',  label: 'Measurements',       icon: Ruler      },
    { id: 'addresses',     label: 'Saved Addresses',    icon: MapPin     },
    { id: 'returns',       label: 'Returns & Refunds',  icon: RotateCcw  },
    { id: 'notifications', label: 'Notifications',      icon: Bell       },
    { id: 'settings',      label: 'Profile Settings',   icon: User       },
  ];

  const handleLogout = () => { logout(); router.push('/login'); };

  const renderOverview = () => (
    <div className="cdp-panel animate-fade-up">
      <div className="cdp-panel-header">
        <div>
          <h2>Welcome back, {user?.name?.split(' ')[0] || 'Customer'}</h2>
          <p className="cdp-panel-sub">Here&apos;s an overview of your account activity.</p>
        </div>
      </div>

      <div className="cdp-stats-grid">
        <div className="cdp-stat-card gold">
          <div className="cdp-stat-icon"><ShoppingBag size={20} /></div>
          <div className="cdp-stat-value">{orders.length}</div>
          <div className="cdp-stat-label">Total Orders</div>
        </div>
        <div className="cdp-stat-card">
          <div className="cdp-stat-icon green"><Heart size={20} /></div>
          <div className="cdp-stat-value">{wishlistItems.length}</div>
          <div className="cdp-stat-label">Saved Items</div>
        </div>
        <div className="cdp-stat-card">
          <div className="cdp-stat-icon blue"><TrendingUp size={20} /></div>
          <div className="cdp-stat-value">${totalSpent.toFixed(0)}</div>
          <div className="cdp-stat-label">Total Spent</div>
        </div>
        <div className="cdp-stat-card">
          <div className="cdp-stat-icon purple"><Star size={20} /></div>
          <div className="cdp-stat-value">{activeOrder ? 1 : 0}</div>
          <div className="cdp-stat-label">Active Orders</div>
        </div>
      </div>

      <div className="cdp-section-header">
        <h3>Recent Orders</h3>
        <button className="cdp-link-btn" onClick={() => setActiveTab('orders')}>View All <ChevronRight size={14} /></button>
      </div>

      {loadingOrders ? (
        <div className="cdp-loading"><div className="cdp-spinner" /><span>Loading orders&hellip;</span></div>
      ) : orders.length === 0 ? (
        <div className="cdp-empty-state">
          <Package size={40} strokeWidth={1.5} />
          <h4>No orders yet</h4>
          <p>When you place your first order, it will appear here.</p>
          <Link href="/" className="cdp-cta-btn">Shop Now</Link>
        </div>
      ) : (
        <div className="cdp-order-list">
          {orders.slice(0, 3).map(order => <OrderCard key={order._id} order={order} />)}
        </div>
      )}

      {wishlistItems.length > 0 && (
        <>
          <div className="cdp-section-header" style={{ marginTop: 40 }}>
            <h3>Saved Items</h3>
            <button className="cdp-link-btn" onClick={() => setActiveTab('wishlist')}>View All <ChevronRight size={14} /></button>
          </div>
          <div className="cdp-wishlist-preview">
            {wishlistItems.slice(0, 4).map(item => (
              <Link key={item.id || item._id} href={`/product/${item.id || item._id}`} className="cdp-wishlist-thumb">
                <img src={item.image || '/assets/hero_model.png'} alt={item.name} />
                <div className="cdp-wishlist-thumb-info">
                  <span>{item.name}</span>
                  <strong>${item.price}</strong>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="cdp-panel animate-fade-up">
      <div className="cdp-panel-header">
        <div>
          <h2>Order History</h2>
          <p className="cdp-panel-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>
      {loadingOrders ? (
        <div className="cdp-loading"><div className="cdp-spinner" /><span>Loading orders&hellip;</span></div>
      ) : orders.length === 0 ? (
        <div className="cdp-empty-state">
          <Package size={40} strokeWidth={1.5} />
          <h4>No orders yet</h4>
          <p>Start shopping and your orders will appear here.</p>
          <Link href="/" className="cdp-cta-btn">Explore Collection</Link>
        </div>
      ) : (
        <div className="cdp-order-list">
          {orders.map(order => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  );

  const renderTracking = () => {
    if (loadingOrders) return (
      <div className="cdp-panel animate-fade-up">
        <div className="cdp-loading"><div className="cdp-spinner" /><span>Loading tracking info&hellip;</span></div>
      </div>
    );
    if (!activeOrder) return (
      <div className="cdp-panel animate-fade-up">
        <div className="cdp-panel-header"><h2>Order Tracking</h2></div>
        <div className="cdp-empty-state">
          <Truck size={40} strokeWidth={1.5} />
          <h4>No active orders</h4>
          <p>You have no orders currently in transit.</p>
        </div>
      </div>
    );

    const steps = [
      { label: 'Order Confirmed',  desc: 'Payment verified successfully',   done: true },
      { label: 'Being Prepared',   desc: 'Artisans are crafting your item', done: ['processing','shipped','delivered'].includes(activeOrder.status) },
      { label: 'Quality Check',    desc: 'Final inspection complete',        done: ['shipped','delivered'].includes(activeOrder.status) },
      { label: 'Out for Delivery', desc: 'Shipped via DHL Express',          done: ['shipped','delivered'].includes(activeOrder.status) },
      { label: 'Delivered',        desc: 'Package received',                 done: activeOrder.status === 'delivered' },
    ];

    return (
      <div className="cdp-panel animate-fade-up">
        <div className="cdp-panel-header">
          <div>
            <h2>Track Your Order</h2>
            <p className="cdp-panel-sub">Tracking: <strong>{activeOrder.orderId}</strong></p>
          </div>
          <StatusPill status={activeOrder.status} />
        </div>
        <div className="cdp-track-card">
          {steps.map((step, i) => (
            <div key={i} className={`cdp-track-step${step.done ? ' done' : ''}${i < steps.length - 1 ? ' has-line' : ''}`}>
              <div className="cdp-track-icon">
                {step.done ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
              </div>
              <div className="cdp-track-body">
                <div className="cdp-track-title">{step.label}</div>
                <div className="cdp-track-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMeasurements = () => (
    <div className="cdp-panel animate-fade-up">
      <div className="cdp-panel-header">
        <div>
          <h2>Saved Measurements</h2>
          <p className="cdp-panel-sub">Your tailoring profile for bespoke orders.</p>
        </div>
      </div>
      <div className="cdp-form-card">
        <form onSubmit={e => e.preventDefault()}>
          <div className="cdp-grid-2">
            {[
              { label: 'Bust (in)', name: 'bust', defaultValue: 34 },
              { label: 'Waist (in)', name: 'waist', defaultValue: 28 },
              { label: 'Hips (in)', name: 'hips', defaultValue: 38 },
              { label: 'Dress Length (in)', name: 'length', defaultValue: 56 },
              { label: 'Shoulder Width (in)', name: 'shoulder', defaultValue: 15 },
              { label: 'Sleeve Length (in)', name: 'sleeve', defaultValue: 22 },
            ].map(f => (
              <div key={f.name} className="cdp-field">
                <label>{f.label}</label>
                <input type="number" defaultValue={f.defaultValue} />
              </div>
            ))}
          </div>
          <button type="submit" className="cdp-save-btn">Save Measurements</button>
        </form>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="cdp-panel animate-fade-up">
      <div className="cdp-panel-header">
        <div>
          <h2>My Wishlist</h2>
          <p className="cdp-panel-sub">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      {wishlistItems.length === 0 ? (
        <div className="cdp-empty-state">
          <Heart size={40} strokeWidth={1.5} />
          <h4>Your wishlist is empty</h4>
          <p>Save items you love and find them here later.</p>
          <Link href="/" className="cdp-cta-btn">Explore Collection</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
          {wishlistItems.map(item => (
            <ProductCard key={item.id || item._id} product={item} onQuickView={() => {}} />
          ))}
        </div>
      )}
    </div>
  );

  const renderDefault = () => (
    <div className="cdp-panel animate-fade-up">
      <div className="cdp-panel-header">
        <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
      </div>
      <div className="cdp-empty-state">
        <AlertCircle size={40} strokeWidth={1.5} />
        <h4>Coming Soon</h4>
        <p>This section is being built. Check back soon!</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':     return renderOverview();
      case 'orders':       return renderOrders();
      case 'tracking':     return renderTracking();
      case 'measurements': return renderMeasurements();
      case 'wishlist':     return renderWishlist();
      default:             return renderDefault();
    }
  };

  return (
    <div className="cdp-root">
      <aside className="cdp-sidebar">
        <div className="cdp-user-block">
          <div className="cdp-avatar-wrap">
            <div className="cdp-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          </div>
          <h3 className="cdp-username">{user?.name || 'Guest'}</h3>
          <p className="cdp-useremail">{user?.email}</p>
          <div className="cdp-member-badge"><Star size={11} /> Premium Member</div>
        </div>

        <div className="cdp-sidebar-stats">
          <div className="cdp-sidebar-stat">
            <span>{orders.length}</span>
            <label>Orders</label>
          </div>
          <div className="cdp-sidebar-stat-divider" />
          <div className="cdp-sidebar-stat">
            <span>{wishlistItems.length}</span>
            <label>Wishlist</label>
          </div>
          <div className="cdp-sidebar-stat-divider" />
          <div className="cdp-sidebar-stat">
            <span>${totalSpent.toFixed(0)}</span>
            <label>Spent</label>
          </div>
        </div>

        <nav className="cdp-nav">
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              className={`cdp-nav-item${activeTab === id ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <span className="cdp-nav-icon"><Icon size={17} /></span>
              <span className="cdp-nav-label">{label}</span>
              {badge > 0 && <span className="cdp-nav-badge">{badge}</span>}
              {activeTab === id && <ChevronRight size={14} className="cdp-nav-arrow" />}
            </button>
          ))}
        </nav>

        <button className="cdp-logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      <main className="cdp-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default CustomerDashboard;
