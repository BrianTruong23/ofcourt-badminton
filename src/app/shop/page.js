import { Suspense } from 'react';
import Link from 'next/link';
import ShopContent from './ShopContent';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import styles from './shop.module.css';

function ShopFallback() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Shop</span>
          </nav>
          <h1 className={styles.title}>All Badminton Rackets</h1>
          <p className={styles.subtitle}>
            Pro-grade frames for power, speed, and control — expertly strung and ready to play.
          </p>
        </div>
      </header>
      <div className={styles.container}>
        <LoadingSkeleton count={6} />
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopContent />
    </Suspense>
  );
}
