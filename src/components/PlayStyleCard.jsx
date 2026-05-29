import Link from 'next/link';
import styles from './PlayStyleCard.module.css';

/**
 * Card describing a play style and the kind of racket that fits it.
 * Links into the shop (optionally with a search query) so the CTA is functional.
 */
export default function PlayStyleCard({ icon, title, description, fit, href }) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {fit && (
        <p className={styles.fit}>
          <span className={styles.fitLabel}>Look for</span>
          {fit}
        </p>
      )}
      <span className={styles.link}>
        Browse rackets
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Link>
  );
}
