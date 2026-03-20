import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

const StarRating = ({ rating }) => (
  <div className="stars" style={{ fontSize: '1.1rem' }}>
    {[1,2,3,4,5].map((s) => (
      <span key={s} className={`star ${s <= Math.floor(rating) ? 'filled' : s - 0.5 <= rating ? 'half' : ''}`}>★</span>
    ))}
  </div>
);

const BADGE_CLASSES = {
  'Best Seller': 'badge-best',
  New: 'badge-new',
  Sale: 'badge-sale',
  Hot: 'badge-hot',
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const product = products.find((p) => p.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [id]);

  if (!product) {
    return (
      <div style={{ paddingTop: 100, minHeight: '60vh' }}>
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h3>Product not found</h3>
          <p>This product doesn't exist or may have been removed.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;
  const inCart = items.some((i) => i.id === product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumbs */}
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link to="/">Home</Link>
          <span><i className="fas fa-chevron-right" /></span>
          <Link to="/products">Products</Link>
          <span><i className="fas fa-chevron-right" /></span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link>
          <span><i className="fas fa-chevron-right" /></span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container pd-main">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-thumbnails">
            {images.map((img, i) => (
              <button
                key={i}
                className={`pd-thumb ${selectedImage === i ? 'active' : ''}`}
                onClick={() => setSelectedImage(i)}
              >
                <img src={img} alt={`${product.name} view ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>

          <div className={`pd-main-image ${zoom ? 'zoomed' : ''}`} onClick={() => setZoom((z) => !z)}>
            <img
              src={images[selectedImage]}
              alt={product.name}
              title={zoom ? 'Click to zoom out' : 'Click to zoom in'}
            />
            {product.badge && (
              <div className="pd-img-badge">
                <span className={`badge ${BADGE_CLASSES[product.badge] || 'badge-primary'}`}>{product.badge}</span>
                {discount && <span className="badge badge-sale">-{discount}%</span>}
              </div>
            )}
            <button className="pd-zoom-hint">
              <i className={`fas fa-${zoom ? 'compress' : 'expand'}`} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pd-info">
          <div className="pd-category-tag">{product.category}</div>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-rating-row">
            <StarRating rating={product.rating} />
            <span className="pd-rating-num">{product.rating}</span>
            <span className="pd-reviews">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="pd-price-block">
            <span className="pd-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="pd-original">${product.originalPrice.toFixed(2)}</span>
                <span className="pd-savings">You save ${(product.originalPrice - product.price).toFixed(2)}</span>
              </>
            )}
          </div>

          <p className="pd-short-desc">{product.description.substring(0, 140)}...</p>

          {/* Stock */}
          <div className="pd-stock">
            <span className={`pd-stock-dot ${product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'}`} />
            <span>
              {product.stock > 10
                ? 'In Stock'
                : product.stock > 0
                ? `Only ${product.stock} left!`
                : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity */}
          <div className="pd-quantity-row">
            <label>Quantity</label>
            <div className="pd-quantity">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}>
                <i className="fas fa-minus" />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>
                <i className="fas fa-plus" />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pd-actions">
            <button
              className={`btn btn-primary btn-lg ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{ flex: 1 }}
            >
              {added ? (
                <><i className="fas fa-check" /> Added to Cart!</>
              ) : (
                <><i className="fas fa-shopping-bag" /> {inCart ? 'Add More to Cart' : 'Add to Cart'}</>
              )}
            </button>
            <button
              className={`btn pd-wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
              onClick={() => setWishlisted((w) => !w)}
              aria-label="Add to wishlist"
            >
              <i className={wishlisted ? 'fas fa-heart' : 'far fa-heart'} />
            </button>
          </div>

          {inCart && (
            <Link to="/cart" className="btn btn-outline" style={{ marginTop: 8, justifyContent: 'center' }}>
              <i className="fas fa-shopping-cart" /> View Cart
            </Link>
          )}

          {/* Features */}
          {product.features && (
            <div className="pd-features">
              <h4>Key Features</h4>
              <div className="pd-features-grid">
                {product.features.map((f, i) => (
                  <div className="pd-feature-pill" key={i}>
                    <i className="fas fa-check-circle" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="pd-trust">
            <div className="trust-item">
              <i className="fas fa-shipping-fast" />
              <span>Free Shipping</span>
            </div>
            <div className="trust-item">
              <i className="fas fa-undo" />
              <span>30-day Returns</span>
            </div>
            <div className="trust-item">
              <i className="fas fa-shield-alt" />
              <span>2-year Warranty</span>
            </div>
            <div className="trust-item">
              <i className="fas fa-lock" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pd-tabs-section">
        <div className="container">
          <div className="pd-tabs">
            {['description', 'features', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">
            {activeTab === 'description' && (
              <div className="pd-description">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'features' && (
              <div className="pd-features-tab">
                {product.features?.map((f, i) => (
                  <div key={i} className="pd-feature-row">
                    <i className="fas fa-check-circle" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="pd-reviews-tab">
                <div className="reviews-summary">
                  <div className="reviews-big-rating">
                    <span className="big-rating-num">{product.rating}</span>
                    <StarRating rating={product.rating} />
                    <span className="reviews-total">{product.reviews} reviews</span>
                  </div>
                  <div className="reviews-bars">
                    {[5,4,3,2,1].map((star) => {
                      const pct = star === 5 ? 65 : star === 4 ? 20 : star === 3 ? 10 : star === 2 ? 3 : 2;
                      return (
                        <div key={star} className="review-bar-row">
                          <span>{star} <i className="fas fa-star" style={{ color: '#F6B17A', fontSize:'0.75rem' }} /></span>
                          <div className="review-bar-track">
                            <div className="review-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <span>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pd-related">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">You Might Like</span>
              <h2 className="section-title">Related <span>Products</span></h2>
            </div>
            <div className="pd-related-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
