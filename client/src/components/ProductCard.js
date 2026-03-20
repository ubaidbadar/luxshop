import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const StarRating = ({ rating }) => (
  <div className="stars" aria-label={`${rating} stars`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={`star ${s <= Math.floor(rating) ? 'filled' : s - 0.5 <= rating ? 'half' : ''}`}
      >
        ★
      </span>
    ))}
  </div>
);

const BADGE_CLASSES = {
  'Best Seller': 'badge-best',
  New: 'badge-new',
  Sale: 'badge-sale',
  Hot: 'badge-hot',
};

const ProductCard = ({ product, style }) => {
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const inCart = items.some((i) => i.id === product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card" style={style}>
      {/* Image */}
      <div className="pc-image-wrap">
        {!imgLoaded && <div className="pc-skeleton skeleton" />}
        <img
          src={product.image}
          alt={product.name}
          className={`pc-image ${imgLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badges */}
        <div className="pc-badges">
          {product.badge && (
            <span className={`badge ${BADGE_CLASSES[product.badge] || 'badge-primary'}`}>
              {product.badge}
            </span>
          )}
          {discount && <span className="badge badge-sale">-{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button
          className={`pc-wishlist ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >
          <i className={wishlisted ? 'fas fa-heart' : 'far fa-heart'} />
        </button>

        {/* Hover overlay */}
        <div className="pc-overlay">
          <button
            className={`pc-add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
          >
            {added ? (
              <><i className="fas fa-check" /> Added!</>
            ) : inCart ? (
              <><i className="fas fa-plus" /> Add More</>
            ) : (
              <><i className="fas fa-shopping-bag" /> Add to Cart</>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pc-info">
        <span className="pc-category">{product.category}</span>
        <h3 className="pc-name">{product.name}</h3>
        <div className="pc-meta">
          <StarRating rating={product.rating} />
          <span className="pc-reviews">({product.reviews})</span>
        </div>
        <div className="pc-pricing">
          <span className="pc-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="pc-original">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
