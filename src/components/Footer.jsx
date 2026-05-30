import Link from 'next/link';
import SiteMark from './SiteMark';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoIcon} aria-hidden="true">
                <SiteMark title="" className={styles.logoMark} />
              </span>
              <span className={styles.logoText}>OfCourt</span>
            </Link>
            <p className={styles.tagline}>
              Premium badminton rackets, hand-picked and expertly strung. We help
              players choose the right frame for power, speed, and control.
            </p>
            <div className={styles.social}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 8.5a3 3 0 0 0-2.1-2.1C18 6 12 6 12 6s-6 0-7.9.4A3 3 0 0 0 2 8.5 31 31 0 0 0 1.7 12 31 31 0 0 0 2 15.5a3 3 0 0 0 2.1 2.1C6 18 12 18 12 18s6 0 7.9-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22.3 12 31 31 0 0 0 22 8.5z" />
                  <polygon points="10 9 15 12 10 15" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Shop</h3>
            <div className={styles.links}>
              <Link href="/shop" className={styles.link}>All Rackets</Link>
              <Link href="/shop?style=Power" className={styles.link}>Power</Link>
              <Link href="/shop?style=Speed" className={styles.link}>Speed</Link>
              <Link href="/shop?style=Control" className={styles.link}>Control</Link>
              <Link href="/guide" className={styles.link}>Buying Guide</Link>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Company</h3>
            <div className={styles.links}>
              <Link href="/about" className={styles.link}>About Us</Link>
              <Link href="/contact" className={styles.link}>Contact</Link>
              <Link href="/account" className={styles.link}>My Account</Link>
              <Link href="/orders" className={styles.link}>Order History</Link>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Support</h3>
            <div className={styles.links}>
              <Link href="/track-order" className={styles.link}>Track Order</Link>
              <Link href="/shipping" className={styles.link}>Shipping &amp; Returns</Link>
              <a href="mailto:support@ofcourt.com" className={styles.link}>support@ofcourt.com</a>
              <a href="tel:+15550123456" className={styles.link}>(555) 012-3456</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {year} OfCourt Badminton. All rights reserved.</p>
          <div className={styles.policies}>
            <Link href="/shipping" className={styles.policyLink}>Shipping &amp; Returns</Link>
            <span className={styles.dot}>·</span>
            <Link href="/contact" className={styles.policyLink}>Privacy Policy</Link>
            <span className={styles.dot}>·</span>
            <Link href="/contact" className={styles.policyLink}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
