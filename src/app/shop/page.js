import { listings } from '../data';
import ListingCard from '@/components/ListingCard';
import styles from './shop.module.css';
import Link from 'next/link';

export default function Shop() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
          <h1 className={styles.title}>Racket Collection</h1>
          <p className={styles.subtitle}>Explore our curated selection of professional-grade equipment.</p>
        </div>
      </header>

      <section className={styles.listingsSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
