'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/checkout.module.css';

export default function SuccessPage() {
  useEffect(() => {
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className={styles.shell}>
      <div className={`${styles.page} ${styles.pageNarrow}`}>
        <div className={styles.successHero}>
          <div className={styles.successIcon} aria-hidden="true">✓</div>
          <h1 className={styles.successTitle}>Payment successful</h1>
          <p className={styles.successDesc}>
            Thank you for your order. You&apos;ll receive a confirmation email shortly.
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/shop" className={styles.primaryBtn}>
            Continue shopping
          </Link>
          <Link href="/" className={styles.secondaryBtn}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
