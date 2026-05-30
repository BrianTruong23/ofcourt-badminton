import Link from 'next/link';
import Image from 'next/image';
import CTAButton from './CTAButton';
import BalanceMeter from './BalanceMeter';
import styles from './Hero.module.css';

const playRail = [
  { name: 'Power', note: 'Head-heavy smashes', href: '/shop?style=Power' },
  { name: 'Speed', note: 'Fast doubles drives', href: '/shop?style=Speed' },
  { name: 'Control', note: 'Net touch & placement', href: '/shop?style=Control' },
  { name: 'All-round', note: 'One frame, every game', href: '/shop?style=All-Round' },
];

const featureSpecs = [
  ['Weight', '4U / 83g'],
  ['Shaft', 'Stiff'],
  ['Tension', '20-28 lbs'],
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Faint badminton court backdrop */}
      <svg
        className={styles.courtLines}
        viewBox="0 0 600 760"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          <rect x="40" y="30" width="520" height="700" />
          <line x1="40" y1="230" x2="560" y2="230" />
          <line x1="40" y1="530" x2="560" y2="530" />
          <line x1="300" y1="30" x2="300" y2="730" />
          <line x1="120" y1="30" x2="120" y2="730" />
          <line x1="480" y1="30" x2="480" y2="730" />
          <line x1="40" y1="380" x2="560" y2="380" strokeDasharray="6 10" />
        </g>
      </svg>

      <div className={styles.inner}>
        {/* ===== Editorial copy ===== */}
        <div className={styles.copy}>
          <p className={styles.meta}>
            <span className={styles.metaBrand}>Modern badminton heritage</span>
            <span className={styles.metaDot} aria-hidden="true" />
            <span className={styles.metaPlace}>Tampa, FL</span>
          </p>

          <h1 className={styles.title}>
            Rackets selected for the{' '}
            <em className={styles.titleAccent}>way you play.</em>
          </h1>

          <p className={styles.subtitle}>
            Power, speed, or control {'\u2014'} frames matched to your balance, shaft
            stiffness, and string tension, for singles or fast doubles. Pro-grade
            rackets, strung by hand, shipped ready to play.
          </p>

          <div className={styles.actions}>
            <CTAButton href="/shop" variant="primary" size="lg">
              Shop rackets
            </CTAButton>
            <CTAButton href="#finder" variant="outline" size="lg">
              Find your match
            </CTAButton>
          </div>

          <p className={styles.brandStrip}>
            <span className={styles.brandLabel}>Frames from</span>
            <span className={styles.brandNames}>
              {'Yonex \u00B7 Victor \u00B7 Li-Ning \u00B7 FZ Forza'}
            </span>
          </p>
        </div>

        {/* ===== Card-less editorial product imagery + spec ledger ===== */}
        <figure className={styles.feature}>
          <div className={styles.stage}>
            <Image
              src="https://images.pexels.com/photos/8795115/pexels-photo-8795115.jpeg?auto=compress&cs=tinysrgb&w=620&h=400&fit=crop"
              alt="Friends playing badminton outdoors at sunset"
              fill
              sizes="(max-width: 920px) 100vw, 50vw"
              className={styles.featurePhoto}
              priority
            />
            <div className={styles.stageOverlay} aria-hidden="true" />
            <span className={styles.featureKicker}>For the love of the game</span>
          </div>

          <figcaption className={styles.ledger}>
            <div className={styles.ledgerHead}>
              <div className={styles.ledgerName}>
                <span className={styles.ledgerBrand}>Yonex</span>
                <span className={styles.ledgerModel}>Astrox 99 Pro</span>
              </div>
              <span className={styles.ledgerPrice}>$260</span>
            </div>

            <div className={styles.ledgerBalance}>
              <span className={styles.ledgerKey}>Balance</span>
              <BalanceMeter balance="head" markerColor="var(--accent)" className={styles.ledgerMeter} />
              <strong className={styles.ledgerVal}>Head-heavy</strong>
            </div>

            <dl className={styles.ledgerRows}>
              {featureSpecs.map(([k, v]) => (
                <div key={k} className={styles.ledgerRow}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <Link href="/listing/1" className={styles.ledgerLink}>
              View this racket
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </figcaption>
        </figure>
      </div>

      {/* ===== Shop by play style - integrated contents bar ===== */}
      <nav className={styles.playRail} aria-label="Shop by play style">
        <span className={styles.railHeading}>Shop by play style</span>
        <div className={styles.railItems}>
          {playRail.map((item, i) => (
            <Link key={item.name} href={item.href} className={styles.railItem}>
              <span className={styles.railNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.railText}>
                <span className={styles.railName}>{item.name}</span>
                <span className={styles.railNote}>{item.note}</span>
              </span>
              <svg className={styles.railArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
}
