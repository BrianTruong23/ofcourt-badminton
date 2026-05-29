import CTAButton from './CTAButton';
import RacketIcon from './RacketIcon';
import styles from './Hero.module.css';

const trustRow = [
  {
    label: 'Free shipping over $100',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <path d="M16 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'Expert custom stringing',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    label: 'Secure checkout',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Badminton specialists since day one
          </span>

          <h1 className={styles.title}>
            Find the racket that plays
            <span className={styles.titleAccent}> like you do.</span>
          </h1>

          <p className={styles.subtitle}>
            Pro-grade frames for power, speed, and control &mdash; hand-picked from
            the brands players trust, expertly strung, and shipped ready to win.
          </p>

          <div className={styles.actions}>
            <CTAButton href="/shop" variant="accent" size="lg">
              Shop Rackets
            </CTAButton>
            <CTAButton href="/guide" variant="outline" size="lg">
              Find your racket
            </CTAButton>
          </div>

          <ul className={styles.trustRow}>
            {trustRow.map((item) => (
              <li key={item.label} className={styles.trustItem}>
                <span className={styles.trustIcon} aria-hidden="true">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual}>
          <div className={styles.showcaseCard}>
            <span className={styles.showcaseTag}>Player favorite</span>
            <div className={styles.showcaseStage}>
              <RacketIcon color="#102A43" className={styles.showcaseRacket} />
            </div>
            <div className={styles.showcaseInfo}>
              <span className={styles.showcaseBrand}>Yonex</span>
              <h2 className={styles.showcaseName}>Astrox 99 Pro</h2>
              <div className={styles.showcaseChips}>
                <span className={styles.chip}>Head Heavy</span>
                <span className={styles.chip}>Power</span>
                <span className={styles.chip}>4U</span>
              </div>
              <div className={styles.showcaseFoot}>
                <span className={styles.showcasePrice}>$260</span>
                <CTAButton href="/listing/1" variant="primary" size="md">
                  View details
                </CTAButton>
              </div>
            </div>
          </div>
          <div className={styles.floatBadge} aria-hidden="true">
            <span className={styles.floatBadgeNum}>12+</span>
            <span className={styles.floatBadgeLabel}>pro brands curated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
