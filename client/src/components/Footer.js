import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">✦</div>
              <span>LuxeShop</span>
            </Link>
            <p>Your curated destination for premium products. Quality, elegance, and style — all in one place.</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest" /></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube" /></a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Electronics">Electronics</Link></li>
              <li><Link to="/products?category=Fashion">Fashion</Link></li>
              <li><Link to="/products?category=Home">Home & Living</Link></li>
              <li><Link to="/products?badge=Sale">Sale</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press & Media</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Track Your Order</a></li>
              <li><a href="#">Shipping Info</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>Stay in the Loop</h4>
            <p>Get exclusive deals, style tips, and new arrivals delivered to your inbox.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input type="email" placeholder="your@email.com" required />
              <button type="submit">
                <i className="fas fa-arrow-right" />
              </button>
            </form>
            <p className="newsletter-hint">No spam, ever. Unsubscribe any time.</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} LuxeShop. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div className="footer-payments">
            <span className="payment-pill">Visa</span>
            <span className="payment-pill">Mastercard</span>
            <span className="payment-pill">PayPal</span>
            <span className="payment-pill">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
