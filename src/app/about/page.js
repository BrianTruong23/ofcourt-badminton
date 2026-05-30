import Link from 'next/link';
import CTAButton from '../../components/CTAButton';
import SiteMark from '../../components/SiteMark';
import styles from '../../styles/info.module.css';

export const metadata = {
  title: 'About OfCourt | Badminton Specialists',
  description:
    'OfCourt is a badminton specialist shop. We curate pro-grade rackets, string by hand, and help players choose the right frame.',
};

const values = [
  {
    title: 'Players, not resellers',
    text: 'We play the game and stock the frames we would put in our own bags.',
    icon: (
      <SiteMark title="" className={styles.valueMark} />
    ),
  },
  {
    title: 'Honest guidance',
    text: 'We explain the specs that matter and never push you toward the priciest frame.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
    ),
  },
  {
    title: 'Care in every detail',
    text: 'From hand stringing to careful packaging, your racket arrives ready to play.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.containerWide}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>About</span>
          </nav>
          <span className={styles.eyebrow}>Our story</span>
          <h1 className={styles.title}>Badminton is all we do</h1>
          <p className={styles.lede}>
            OfCourt started with a simple frustration: buying a racket online meant
            guessing. We set out to fix that &mdash; with a focused catalog,
            plain-language guidance, and stringing done properly.
          </p>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.prose}>
          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Why we exist</h2>
            <p className={styles.blockText}>
              The right racket can transform your game. The wrong one holds you back
              for months. Yet most shops bury frames under specs that mean nothing to
              the average player and surround real rackets with marketplace filler.
            </p>
            <p className={styles.blockText}>
              We keep our range tight and pro-grade, explain how each frame plays, and
              match it to your style: power, speed, or control. No noise, just the
              rackets worth playing with.
            </p>
          </section>

          <section>
            <span className={styles.sectionLabel}>What we stand for</span>
            <div className={styles.valuesGrid}>
              {values.map((value) => (
                <div key={value.title} className={styles.valueCard}>
                  <span className={styles.valueIcon} aria-hidden="true">{value.icon}</span>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueText}>{value.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>Have a question?</h2>
            <p className={styles.blockText}>
              Whether you are upgrading from your first racket or chasing the perfect
              competition frame, we are happy to help you choose.
            </p>
            <div className={styles.ctaRow}>
              <CTAButton href="/shop" variant="accent">Browse rackets</CTAButton>
              <CTAButton href="/contact" variant="outline">Contact us</CTAButton>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
