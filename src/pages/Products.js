import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Products.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home'];
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 – $300', min: 100, max: 300 },
  { label: '$300 – $600', min: 300, max: 600 },
  { label: 'Over $600', min: 600, max: Infinity },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';
  const [localCategory, setLocalCategory] = useState(urlCategory);

  useEffect(() => {
    setLocalCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setLocalCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    params.delete('search');
    setSearchParams(params);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (urlSearch) {
      const q = urlSearch.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (localCategory && localCategory !== 'All') {
      result = result.filter((p) => p.category === localCategory);
    }

    // Price
    const { min, max } = PRICE_RANGES[priceRange];
    result = result.filter((p) => p.price >= min && p.price <= max);

    // Sort
    switch (sort) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => b.id - a.id); break;
      default: break;
    }

    return result;
  }, [localCategory, urlSearch, priceRange, sort]);

  const pageTitle = urlSearch
    ? `Search: "${urlSearch}"`
    : localCategory !== 'All'
    ? localCategory
    : 'All Products';

  return (
    <div className="products-page">
      {/* ── PAGE HEADER ── */}
      <div className="products-header">
        <div className="products-header-bg" />
        <div className="container products-header-inner">
          <h1>{pageTitle}</h1>
          <p>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
            {urlSearch && ` for "${urlSearch}"`}
          </p>
        </div>
      </div>

      <div className="container products-layout">
        {/* ── SIDEBAR ── */}
        <aside className={`products-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
              <i className="fas fa-times" />
            </button>
          </div>

          {/* Category filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">
              <i className="fas fa-tag" /> Category
            </h4>
            <div className="filter-options">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-option ${localCategory === cat ? 'active' : ''}`}
                  onClick={() => { handleCategoryChange(cat); setSidebarOpen(false); }}
                >
                  <span>{cat}</span>
                  <span className="filter-count">
                    {cat === 'All' ? products.length : products.filter((p) => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">
              <i className="fas fa-dollar-sign" /> Price Range
            </h4>
            <div className="filter-options">
              {PRICE_RANGES.map((range, i) => (
                <button
                  key={i}
                  className={`filter-option ${priceRange === i ? 'active' : ''}`}
                  onClick={() => { setPriceRange(i); setSidebarOpen(false); }}
                >
                  <span>{range.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            className="btn btn-outline"
            style={{ width: '100%', marginTop: 8 }}
            onClick={() => {
              setLocalCategory('All');
              setPriceRange(0);
              setSort('featured');
              setSearchParams({});
            }}
          >
            <i className="fas fa-undo" /> Reset Filters
          </button>
        </aside>

        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── MAIN CONTENT ── */}
        <div className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <button className="filter-toggle-btn" onClick={() => setSidebarOpen(true)}>
              <i className="fas fa-sliders-h" /> Filters
            </button>
            <span className="products-count">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>
            <div className="sort-select-wrap">
              <i className="fas fa-sort" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="sort-select"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters */}
          {(localCategory !== 'All' || priceRange !== 0 || urlSearch) && (
            <div className="active-filters">
              {urlSearch && (
                <span className="active-filter-tag">
                  Search: "{urlSearch}"
                  <button onClick={() => setSearchParams({})}>×</button>
                </span>
              )}
              {localCategory !== 'All' && (
                <span className="active-filter-tag">
                  {localCategory}
                  <button onClick={() => handleCategoryChange('All')}>×</button>
                </span>
              )}
              {priceRange !== 0 && (
                <span className="active-filter-tag">
                  {PRICE_RANGES[priceRange].label}
                  <button onClick={() => setPriceRange(0)}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Grid / Empty */}
          {filtered.length > 0 ? (
            <div className="products-grid-main">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 40}ms` }} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search for something else.</p>
              <button
                className="btn btn-primary"
                onClick={() => { setLocalCategory('All'); setPriceRange(0); setSearchParams({}); }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
