import Link from 'next/link';
import CTAButton from '../../components/CTAButton';
import styles from '../../styles/info.module.css';

export const metadata = {
  title: 'Racket Buying Guide | OfCourt Badminton',
  description:
    'How to choose a badminton racket: play style, weight, balance, stiffness, and string tension explained in plain language.',
};

const guideCards = [
  {
    title: 'Play style first',
    text: 'Your game decides the frame. Match the racket to how you actually play.',
    list: [
      'Power: head-heavy frames for steep smashes',
      'Speed: head-light frames for fast doubles',
      'Control: even balance for precise placement',
      'All-round: even balance, medium flex',
    ],
  },
  {
    title: 'Weight (U rating)',
    text: 'Lower U numbers are heavier. Most players land between 3U and 4U.',
    list: [
      '3U (around 88g): more weight behind each shot',
      '4U (around 83g): faster, easier to maneuver',
      'Lighter frames suit quick exchanges',
      'Heavier frames reward a full swing',
    ],
  },
  {
    title: 'Balance point',
    text: 'Where the weight sits changes how the racket feels in your hand.',
    list: [
      'Head-heavy: more power, slower handling',
      'Head-light: faster, more defensive',
      'Even balance: a versatile middle ground',
    ],
  },
  {
    title: 'Shaft stiffness',
    text: 'Stiffer shafts reward fast, technical swings; flexible shafts are more forgiving.',
    list: [
      'Extra stiff: for advanced, fast swings',
      'Stiff: control for intermediate to advanced',
      'Medium: forgiving and comfortable',
    ],
  },
  {
    title: 'String tension',
    text: 'Tension shapes the balance between power and control.',
    list: [
      'Lower (22 to 24 lbs): more power, larger sweet spot',
      'Higher (26 to 28 lbs): more control and precision',
      'Not sure? 24 lbs is a great starting point',
    ],
  },
  {
    title: 'Grip and strings',
    text: 'Small choices that make a real difference in feel and comfort.',
    list: [
      'Add an overgrip for tackiness or sweat absorption',
      'BG65 for durability, BG80 for power, Exbolt for control',
      'We string every racket by hand before it ships',
    ],
  },
];

export default function GuidePage() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.containerWide}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Guide</span>
          </nav>
          <span className={styles.eyebrow}>Buying guide</span>
          <h1 className={styles.title}>How to choose your racket</h1>
          <p className={styles.lede}>
            A few minutes here will save you from a mismatched frame. Here is what
            actually matters when picking a badminton racket &mdash; no jargon, no fluff.
          </p>
        </div>
      </header>

      <div className={styles.containerWide}>
        <div className={styles.guideGrid}>
          {guideCards.map((card) => (
            <article key={card.title} className={styles.guideCard}>
              <h2 className={styles.guideCardTitle}>{card.title}</h2>
              <p className={styles.guideCardText}>{card.text}</p>
              <ul className={styles.guideList}>
                {card.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className={styles.ctaRow} style={{ marginTop: 40, justifyContent: 'center' }}>
          <CTAButton href="/shop" variant="accent" size="lg">Shop rackets</CTAButton>
          <CTAButton href="/contact" variant="outline" size="lg">Ask an expert</CTAButton>
        </div>
      </div>
    </main>
  );
}
