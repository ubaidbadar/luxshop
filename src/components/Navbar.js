import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon-wrap">✦</div>
            <span>LuxeShop</span>
          </Link>

          {/* Desktop Links */}
          <div className="navbar-links">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link to="/products" className={isActive('/products') ? 'active' : ''}>All Products</Link>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Fashion">Fashion</Link>
            <Link to="/products?category=Home">Home</Link>
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="search-form">
                <i className="fas fa-search search-form-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="search-close-btn">
                  <i className="fas fa-times" />
                </button>
              </form>
            ) : (
              <>
                <button onClick={() => setSearchOpen(true)} className="icon-btn" aria-label="Search">
                  <i className="fas fa-search" />
                </button>
                <button className="icon-btn" aria-label="Wishlist">
                  <i className="far fa-heart" />
                </button>
                <Link to="/cart" className="cart-btn" aria-label={`Cart (${totalItems} items)`}>
                  <i className="fas fa-shopping-bag" />
                  {totalItems > 0 && (
                    <span className="cart-badge" key={totalItems}>{totalItems > 99 ? '99+' : totalItems}</span>
                  )}
                </Link>
              </>
            )}

            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <nav className="mobile-nav">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link to="/products">All Products</Link>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Fashion">Fashion</Link>
            <Link to="/products?category=Home">Home & Living</Link>
          </nav>
          <div className="mobile-menu-footer">
            <Link to="/cart" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <i className="fas fa-shopping-bag" /> View Cart ({totalItems})
            </Link>
          </div>
        </div>
      </div>
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;
