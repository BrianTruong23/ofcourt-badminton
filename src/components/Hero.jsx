import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

const panels = {
  lead: {
    src: '/images/court3.png',
    alt: 'Players moving across a bright badminton court',
  },
  top: {
    src: 'https://images.pexels.com/photos/8795115/pexels-photo-8795115.jpeg?auto=compress&cs=tinysrgb&w=980&h=520&fit=crop',
    alt: 'Friends playing badminton outdoors',
  },
  bottom: {
    src: '/images/court1.png',
    alt: 'Competition badminton courts in a modern indoor venue',
  },
};

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.banner} aria-label="OfCourt badminton racket finder">
        <div className={`${styles.panel} ${styles.leadPanel}`}>
          <Image
            src={panels.lead.src}
            alt={panels.lead.alt}
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            className={styles.image}
            priority
          />
          <div className={styles.leadShade} aria-hidden="true" />
          <div className={styles.copy}>
            <p className={styles.eyebrow}>At the court</p>
            <h1 className={styles.title}>
              Whether you play for fun or compete for points, the right frame changes everything.
            </h1>
            <Link href="#finder" className={styles.findButton}>
              Find your frame
            </Link>
          </div>
        </div>

        <div className={styles.sidePanels}>
          <Link href="/shop" className={`${styles.panel} ${styles.sidePanel}`}>
            <Image
              src={panels.top.src}
              alt={panels.top.alt}
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              className={styles.image}
            />
            <span className={styles.sideShade} aria-hidden="true" />
            <span className={styles.panelLabel}>For every player</span>
          </Link>

          <Link href="/shop" className={`${styles.panel} ${styles.sidePanel}`}>
            <Image
              src={panels.bottom.src}
              alt={panels.bottom.alt}
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              className={styles.image}
            />
            <span className={styles.sideShade} aria-hidden="true" />
            <span className={styles.panelLabel}>Ready to play</span>
          </Link>
        </div>
      </div>
      <div className={styles.colorBar} aria-hidden="true" />
    </section>
  );
}
