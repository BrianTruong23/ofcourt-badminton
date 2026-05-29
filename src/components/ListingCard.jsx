'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { getProductMeta } from '../app/data';
import RacketIcon from './RacketIcon';
import styles from './ListingCard.module.css';

export default function ListingCard({ listing }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const meta = getProductMeta(listing);

  const handleAdd = () => {
    const basePrice = parseInt(String(listing.price).replace(/[^0-9.]/g, ''), 10) || 0;
    addToCart({
      ...listing,
      customization: {
        string: 'Unstrung',
        tension: '24 lbs',
        grip: 'Original',
        stringColor: 'White',
      },
      totalPrice: basePrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className={styles.card}>
      <Link
        href={`/listing/${listing.id}`}
        className={styles.media}
        aria-label={`View details for ${listing.title}`}
      >
        <span className={styles.levelTag}>{meta.level}</span>
        {listing.brand && <span className={styles.brand}>{listing.brand}</span>}
        <RacketIcon color={listing.color || '#102A43'} className={styles.racketMark} />
      </Link>

      <div className={styles.content}>
        <div className={styles.topLine}>
          {listing.series && <span className={styles.series}>{listing.series}</span>}
          <span className={styles.styleTag}>{meta.style}</span>
        </div>

        <h3 className={styles.title}>
          <Link href={`/listing/${listing.id}`}>{listing.title}</Link>
        </h3>

        <p className={styles.benefit}>{meta.benefit}</p>

        <ul className={styles.specs}>
          {[listing.specs?.weight, listing.specs?.balance].filter(Boolean).map((spec) => (
            <li key={spec} className={styles.specChip}>{spec}</li>
          ))}
        </ul>

        <div className={styles.ratingRow}>
          {meta.rating ? (
            <span className={styles.rating}>
              <Stars value={meta.rating} />
              <span className={styles.ratingText}>
                {meta.rating.toFixed(1)}
                {meta.reviewCount ? ` (${meta.reviewCount})` : ''}
              </span>
            </span>
          ) : (
            <span className={styles.newTag}>New arrival</span>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>{listing.price}</span>
          <div className={styles.cta}>
            <Link href={`/listing/${listing.id}`} className={styles.viewButton}>
              Details
            </Link>
            <button type="button" className={styles.addButton} onClick={handleAdd}>
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Stars({ value }) {
  return (
    <span className={styles.stars} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(value) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9" />
        </svg>
      ))}
    </span>
  );
}
