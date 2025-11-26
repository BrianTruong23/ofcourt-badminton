'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { listings } from '../data';
import ListingCard from '@/components/ListingCard';
import styles from './shop.module.css';

export default function ShopContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Filter listings based on search query
  const filteredListings = query
    ? listings.filter((listing) => {
        const searchLower = query.toLowerCase();
        return (
          listing.title.toLowerCase().includes(searchLower) ||
          listing.series.toLowerCase().includes(searchLower) ||
          listing.description.toLowerCase().includes(searchLower)
        );
      })
    : listings;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
          <h1 className={styles.title}>
            {query ? `Search Results for "${query}"` : 'Our Racket Collection'}
          </h1>
          {query && (
            <p className={styles.subtitle}>
              Found {filteredListings.length} {filteredListings.length === 1 ? 'racket' : 'rackets'}
            </p>
          )}
        </div>
      </header>

      <div className={styles.container}>
        {filteredListings.length > 0 ? (
          <div className={styles.grid}>
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <h2>No rackets found</h2>
            <p>Try adjusting your search terms or <Link href="/shop">browse all rackets</Link></p>
          </div>
        )}
      </div>
    </main>
  );
}
