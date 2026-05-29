import Link from 'next/link';
import CheckoutStepper from './CheckoutStepper';
import styles from '../../styles/checkout.module.css';

export default function CheckoutNav({ current = 'bag' }) {
  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.stepperLogo}>
          <span className={styles.stepperLogoIcon} aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="11" cy="8" rx="6.5" ry="7" />
              <path d="M6.5 13.5 L4 21" />
            </svg>
          </span>
          OfCourt
        </Link>

        <CheckoutStepper current={current} />

        <span className={styles.stepperSecure}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure checkout
        </span>
      </div>
    </header>
  );
}
