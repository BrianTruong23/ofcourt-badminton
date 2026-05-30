'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { listings, getProductMeta } from '../data';
import ListingCard from '../../components/ListingCard';
import styles from './shop.module.css';

function priceValue(price) {
  const n = parseFloat(String(price).replace(/[^0-9.]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

const STYLE_FILTERS = ['All', 'Power', 'Speed', 'Control', 'All-Round'];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const styleParam = searchParams.get('style') || '';
  const levelParam = searchParams.get('level') || '';
  const weightParam = searchParams.get('weight') || '';

  const [activeStyle, setActiveStyle] = useState(
    STYLE_FILTERS.includes(styleParam) ? styleParam : 'All'
  );
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const brands = ['all', ...new Set(listings.map((l) => l.brand))];

  const filteredListings = useMemo(() => {
    const filtered = listings.filter((listing) => {
      const meta = getProductMeta(listing);

      const matchesSearch =
        !query ||
        listing.title.toLowerCase().includes(query.toLowerCase()) ||
        listing.series.toLowerCase().includes(query.toLowerCase()) ||
        listing.description.toLowerCase().includes(query.toLowerCase());

      const matchesBrand = selectedBrand === 'all' || listing.brand === selectedBrand;
      const matchesStyle = activeStyle === 'All' || meta.style === activeStyle;
      const matchesLevel = !levelParam || meta.level === levelParam;
      const matchesWeight = !weightParam || meta.weightClass === weightParam;

      return matchesSearch && matchesBrand && matchesStyle && matchesLevel && matchesWeight;
    });

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => priceValue(a.price) - priceValue(b.price));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => priceValue(b.price) - priceValue(a.price));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [query, selectedBrand, sortBy, activeStyle, levelParam, weightParam]);

  const activeContext = levelParam || weightParam || (styleParam && styleParam !== 'All' ? styleParam : '');
  const heading = query
    ? `Results for “${query}”`
    : activeContext
    ? `${activeContext} Rackets`
    : 'All Badminton Rackets';

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Shop</span>
          </nav>
          <h1 className={styles.title}>{heading}</h1>
          <p className={styles.subtitle}>
            {query
              ? `${filteredListings.length} ${filteredListings.length === 1 ? 'racket matches' : 'rackets match'} your search.`
              : 'Pro-grade frames for power, speed, and control — expertly strung and ready to play.'}
          </p>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.styleTabs}>
          {STYLE_FILTERS.map((style) => (
            <button
              key={style}
              className={`${styles.styleTab} ${activeStyle === style ? styles.styleTabActive : ''}`}
              onClick={() => setActiveStyle(style)}
            >
              {style}
            </button>
          ))}
        </div>

        <div className={styles.shopLayout}>
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Brand</h3>
              <div className={styles.filterOptions}>
                {brands.map((brand) => (
                  <label key={brand} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="brand"
                      value={brand}
                      checked={selectedBrand === brand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    />
                    {brand === 'all' ? 'All brands' : brand}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>Sort by</h3>
              <div className={styles.filterOptions}>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="sort"
                    value="featured"
                    checked={sortBy === 'featured'}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                  Featured
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="sort"
                    value="price-asc"
                    checked={sortBy === 'price-asc'}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                  Price: Low to High
                </label>
                <label className={styles.filterOption}>
                  <input
                    type="radio"
                    name="sort"
                    value="price-desc"
                    checked={sortBy === 'price-desc'}
                    onChange={(e) => setSortBy(e.target.value)}
                  />
                  Price: High to Low
                </label>
              </div>
            </div>
          </aside>

          <div className={styles.mainContent}>
            <div className={styles.resultHeader}>
              <span className={styles.resultCount}>
                {filteredListings.length} {filteredListings.length === 1 ? 'racket' : 'rackets'}
              </span>
            </div>

            {filteredListings.length > 0 ? (
              <div className={styles.grid}>
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <h2>No rackets found</h2>
                <p>
                  Try a different style or brand, or{' '}
                  <Link href="/shop">browse all rackets</Link>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
