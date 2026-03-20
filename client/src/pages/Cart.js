import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 350);
  };

  const discount = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : null;

  return (
    <div className={`cart-item ${removing ? 'removing' : ''}`}>
      <Link to={`/products/${item.id}`} className="cart-item-img-link">
        <img src={item.image} alt={item.name} loading="lazy" />
      </Link>

      <div className="cart-item-info">
        <span className="cart-item-category">{item.category}</span>
        <Link to={`/products/${item.id}`} className="cart-item-name">{item.name}</Link>
        <div className="cart-item-meta">
          {discount && <span className="badge badge-sale" style={{ fontSize: '0.68rem' }}>-{discount}%</span>}
          {item.originalPrice && (
            <span className="cart-item-original">${item.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="cart-item-quantity">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <i className="fas fa-minus" />
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <i className="fas fa-plus" />
        </button>
      </div>

      <div className="cart-item-price">
        <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
        <span className="cart-item-unit">${item.price.toFixed(2)} each</span>
      </div>

      <button className="cart-item-remove" onClick={handleRemove} aria-label="Remove item">
        <i className="fas fa-trash-alt" />
      </button>
    </div>
  );
};

const PROMO_CODES = { LUXE20: 0.2, SAVE10: 0.1, FREESHIP: 0 };

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES.hasOwnProperty(code)) {
      setAppliedPromo({ code, discount: PROMO_CODES[code] });
      setPromoSuccess(`Promo code "${code}" applied!`);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try LUXE20, SAVE10, or FREESHIP.');
      setPromoSuccess('');
      setAppliedPromo(null);
    }
  };

  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const promoDiscount = appliedPromo ? totalPrice * appliedPromo.discount : 0;
  const tax = (totalPrice - promoDiscount) * 0.08;
  const orderTotal = totalPrice - promoDiscount + shipping + tax;

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setOrderPlaced(true);
      clearCart();
    }, 2200);
  };

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <div className="container order-success">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping with LuxeShop. You'll receive a confirmation email shortly.</p>
          <div className="success-details">
            <div className="success-detail-item">
              <i className="fas fa-truck" />
              <span>Estimated delivery: 3-5 business days</span>
            </div>
            <div className="success-detail-item">
              <i className="fas fa-envelope" />
              <span>Confirmation sent to your email</span>
            </div>
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">
            <i className="fas fa-shopping-bag" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-header-section">
            <h1>Shopping Cart</h1>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet. Start exploring our amazing products!</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <i className="fas fa-shopping-bag" /> Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-hero">
        <div className="cart-hero-bg" />
        <div className="container cart-hero-inner">
          <h1>Shopping Cart</h1>
          <p>{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="container cart-layout">
        {/* Items Column */}
        <div className="cart-items-col">
          {/* Items header */}
          <div className="cart-items-header">
            <span>Product</span>
            <span className="cart-header-qty">Quantity</span>
            <span className="cart-header-price">Price</span>
            <span></span>
          </div>

          {/* Items */}
          <div className="cart-items-list">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Cart Actions */}
          <div className="cart-actions-row">
            <Link to="/products" className="btn btn-outline">
              <i className="fas fa-arrow-left" /> Continue Shopping
            </Link>
            <button className="btn btn-ghost-dark" onClick={clearCart}>
              <i className="fas fa-trash" /> Clear Cart
            </button>
          </div>

          {/* Promo Banner */}
          <div className="cart-promo-banner">
            <i className="fas fa-truck" />
            <span>
              {shipping === 0
                ? '🎉 You qualify for FREE shipping!'
                : `Add $${(50 - totalPrice).toFixed(2)} more for FREE shipping`}
            </span>
            {shipping === 0 ? null : (
              <div className="promo-progress-track">
                <div
                  className="promo-progress-fill"
                  style={{ width: `${Math.min((totalPrice / 50) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Summary Column */}
        <div className="cart-summary-col">
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">Order Summary</h3>

            {/* Line items */}
            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {appliedPromo && appliedPromo.discount > 0 && (
                <div className="summary-line discount">
                  <span>Promo ({appliedPromo.code})</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-ship' : ''}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-line">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="promo-section">
              <label className="promo-label">Promo Code</label>
              <div className="promo-input-row">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. LUXE20)"
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  className="promo-input"
                />
                <button className="promo-apply-btn" onClick={handleApplyPromo}>
                  Apply
                </button>
              </div>
              {promoError && <p className="promo-msg error"><i className="fas fa-times-circle" /> {promoError}</p>}
              {promoSuccess && <p className="promo-msg success"><i className="fas fa-check-circle" /> {promoSuccess}</p>}
            </div>

            {/* Total */}
            <div className="summary-total">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <button
              className={`btn btn-primary btn-lg checkout-btn ${checkingOut ? 'loading' : ''}`}
              onClick={handleCheckout}
              disabled={checkingOut}
            >
              {checkingOut ? (
                <>
                  <span className="spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock" /> Secure Checkout
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="summary-trust">
              <span><i className="fas fa-shield-alt" /> SSL Secured</span>
              <span><i className="fas fa-undo" /> Free Returns</span>
              <span><i className="fas fa-headset" /> 24/7 Support</span>
            </div>

            {/* Payment logos */}
            <div className="payment-methods">
              <span className="payment-pill">Visa</span>
              <span className="payment-pill">Mastercard</span>
              <span className="payment-pill">PayPal</span>
              <span className="payment-pill">Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
