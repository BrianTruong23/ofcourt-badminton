import styles from './LoadingSkeleton.module.css';

/**
 * Skeleton placeholder grid that mirrors the shop product layout so there is
 * no layout shift while the real content loads.
 */
export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.image} ${styles.shimmer}`} />
          <div className={styles.body}>
            <div className={`${styles.line} ${styles.short} ${styles.shimmer}`} />
            <div className={`${styles.line} ${styles.title} ${styles.shimmer}`} />
            <div className={`${styles.chips}`}>
              <span className={`${styles.chip} ${styles.shimmer}`} />
              <span className={`${styles.chip} ${styles.shimmer}`} />
            </div>
            <div className={styles.footer}>
              <div className={`${styles.line} ${styles.price} ${styles.shimmer}`} />
              <div className={`${styles.button} ${styles.shimmer}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
