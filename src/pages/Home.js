import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Home.css';

const FEATURES = [
  { icon: 'fas fa-shipping-fast', title: 'Free Shipping', desc: 'On all orders over $50. Fast &amp; reliable delivery worldwide.', color: '#667eea' },
  { icon: 'fas fa-undo-alt', title: 'Easy Returns', desc: '30-day hassle-free returns. No questions asked.', color: '#f093fb' },
  { icon: 'fas fa-lock', title: 'Secure Payment', desc: '256-bit SSL encryption. Your data is always safe.', color: '#43e97b' },
  { icon: 'fas fa-headset', title: '24/7 Support', desc: 'Dedicated customer support around the clock.', color: '#f7971e' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Interior Designer', avatar: 'https://i.pravatar.cc/64?img=47', text: 'The quality of the products is outstanding. My order arrived in perfect condition and ahead of schedule!', rating: 5 },
  { name: 'James K.', role: 'Tech Enthusiast', avatar: 'https://i.pravatar.cc/64?img=60', text: "I've been shopping here for 2 years. The headphones I bought are still my daily drivers — absolutely worth every penny.", rating: 5 },
  { name: 'Amara L.', role: 'Fashion Blogger', avatar: 'https://i.pravatar.cc/64?img=25', text: 'Stunning collection and the customer service team resolved my query instantly. Will definitely shop again!', rating: 5 },
];

const CounterBadge = ({ end, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <div className="stat-item">
      <span className="stat-number">{count.toLocaleString()}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const Home = () => {
  const featured = products.slice(0, 8);
  const bestSellers = products.filter((p) => p.badge === 'Best Seller').slice(0, 4);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid-pattern" />
        </div>

        <div className="container hero-inner">
          <div className={`hero-text ${visible ? 'visible' : ''}`}>
            <div className="hero-tag-pill">
              <span className="hero-tag-dot" />
              New Collection 2025
            </div>
            <h1 className="hero-title">
              Discover Your<br />
              <span className="hero-gradient-text">Perfect Style</span>
            </h1>
            <p className="hero-desc">
              Explore thousands of premium products curated for the modern lifestyle.
              Quality, elegance, and affordability — all beautifully combined.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now <i className="fas fa-arrow-right" />
              </Link>
              <Link to="/products?category=Electronics" className="btn btn-ghost btn-lg">
                Explore Tech
              </Link>
            </div>

            <div className="hero-stats">
              <CounterBadge end={50} suffix="K+" label="Happy Customers" />
              <div className="stat-divider" />
              <CounterBadge end={1200} suffix="+" label="Products" />
              <div className="stat-divider" />
              <CounterBadge end={98} suffix="%" label="Satisfaction" />
            </div>
          </div>

          <div className={`hero-visual ${visible ? 'visible' : ''}`}>
            <div className="hero-card-grid">
              <div className="hero-product-card hero-card-main">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=360&h=360&fit=crop&auto=format" alt="Headphones" />
                <div className="hero-card-info">
                  <p>Premium Headphones</p>
                  <span>$299.99</span>
                </div>
              </div>
              <div className="hero-product-card hero-card-sm hero-card-sm-1">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&auto=format" alt="Watch" />
              </div>
              <div className="hero-product-card hero-card-sm hero-card-sm-2">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&auto=format" alt="Sneakers" />
              </div>
              <div className="hero-floating-badge hero-badge-rating">
                <i className="fas fa-star" /> 4.9 Stars
              </div>
              <div className="hero-floating-badge hero-badge-sale">
                🔥 Sale 30% Off
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="features-bar">
        <div className="container features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-item" key={i} style={{ '--accent-color': f.color }}>
              <div className="feature-icon">
                <i className={f.icon} />
              </div>
              <div>
                <h4>{f.title}</h4>
                <p dangerouslySetInnerHTML={{ __html: f.desc }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Browse By</span>
            <h2 className="section-title">Shop by <span>Category</span></h2>
            <p className="section-subtitle">From the latest tech to timeless fashion — find everything you love.</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                to={`/products?category=${cat.name}`}
                className="category-card"
                key={cat.id}
                style={{ '--cat-gradient': cat.gradient }}
              >
                <div className="category-bg" />
                <div className="category-body">
                  <div className="category-icon">{cat.icon}</div>
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  {cat.count > 0 && <span className="category-count">{cat.count} items</span>}
                </div>
                <div className="category-arrow">
                  <i className="fas fa-arrow-right" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="products-section">
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="section-tag">Handpicked</span>
              <h2 className="section-title">Featured <span>Products</span></h2>
            </div>
            <Link to="/products" className="btn btn-outline">
              View All <i className="fas fa-arrow-right" />
            </Link>
          </div>

          {/* Category filter */}
          <div className="filter-pills">
            {['All', 'Electronics', 'Fashion', 'Home'].map((c) => (
              <button
                key={c}
                className={`filter-pill ${activeCategory === c ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {featured
              .filter((p) => activeCategory === 'All' || p.category === activeCategory)
              .map((p, i) => (
                <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 60}ms` }} />
              ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="promo-banner">
        <div className="promo-bg">
          <div className="promo-orb promo-orb-1" />
          <div className="promo-orb promo-orb-2" />
        </div>
        <div className="container promo-inner">
          <div className="promo-content">
            <span className="promo-eyebrow">Limited Time Offer</span>
            <h2>Get <span>20% Off</span> Your First Order</h2>
            <p>Use code <strong>LUXE20</strong> at checkout. Valid for new customers only.</p>
            <Link to="/products" className="btn btn-white btn-lg">
              Claim Offer <i className="fas fa-gift" />
            </Link>
          </div>
          <div className="promo-visual">
            <div className="promo-code-card">
              <p>Your Promo Code</p>
              <div className="promo-code">LUXE20</div>
              <p className="promo-code-sub">20% off everything</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Top Picks</span>
            <h2 className="section-title">Best <span>Sellers</span></h2>
            <p className="section-subtitle">The products our customers love most — tried, tested, and trusted.</p>
          </div>
          <div className="products-grid best-sellers-grid">
            {bestSellers.map((p, i) => (
              <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Reviews</span>
            <h2 className="section-title">What Our <span>Customers Say</span></h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">
                  {Array(t.rating).fill(null).map((_, si) => <span key={si} className="star filled">★</span>)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Ready to Upgrade Your Lifestyle?</h2>
            <p>Join over 50,000 happy customers who shop with LuxeShop.</p>
          </div>
          <div className="cta-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
