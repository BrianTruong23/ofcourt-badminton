import Link from 'next/link';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import ListingCard from '../components/ListingCard';
import CTAButton from '../components/CTAButton';
import { listings, getProductMeta } from './data';
import styles from './page.module.css';

const sellingPoints = [
  {
    title: 'Power',
    text: 'Head-heavy frames that turn your swing into steep, match-ending smashes.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 L3 14h7l-1 8 10-12h-7z" />
      </svg>
    ),
  },
  {
    title: 'Speed',
    text: 'Aerodynamic, head-light rackets built for fast drives and quick defense.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h7" /><path d="M2 7h11" /><path d="M2 17h11" />
        <path d="m16 6 6 6-6 6" />
      </svg>
    ),
  },
  {
    title: 'Control',
    text: 'Even-balance frames with a longer shuttle hold for precise placement.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: 'Durability',
    text: 'High-modulus graphite frames from trusted brands, built to last seasons.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5z" />
      </svg>
    ),
  },
];

const categories = [
  { name: 'Power', desc: 'Smash-focused frames', href: '/shop?style=Power' },
  { name: 'Speed', desc: 'Fast & aerodynamic', href: '/shop?style=Speed' },
  { name: 'Control', desc: 'Precision & touch', href: '/shop?style=Control' },
  { name: 'Lightweight', desc: '4U easy-handling', href: '/shop?weight=Lightweight' },
  { name: 'Intermediate', desc: 'Stepping up your game', href: '/shop?level=Intermediate' },
  { name: 'Advanced', desc: 'Competition-ready', href: '/shop?level=Advanced' },
];

const guarantees = [
  {
    title: 'Quality guarantee',
    text: 'Authentic frames from established brands, inspected before they ship.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: 'Free shipping over $100',
    text: 'Fast, tracked delivery — or free local pickup in Tampa, FL.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Secure checkout',
    text: 'Pay safely with PayPal or any major card — no account required.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'Expert stringing',
    text: 'Add your preferred string and tension — strung by hand before dispatch.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-5" />
      </svg>
    ),
  },
];

const faqs = [
  {
    q: 'How do I choose the right racket?',
    a: 'Start with how you play. Power players suit head-heavy frames, fast doubles players prefer head-light and lightweight rackets, and all-court players do best with even balance. Our buying guide walks you through it, and every product page lists the specs that matter.',
  },
  {
    q: 'Can I customize the string and tension?',
    a: 'Yes. On any product you can choose your string type, tension, grip, and string color. We string each racket by hand before it ships.',
  },
  {
    q: 'Which brands do you carry?',
    a: 'We curate frames from established badminton brands such as Yonex, Victor, and Li-Ning — pro-grade rackets only, never marketplace filler.',
  },
  {
    q: 'What are your shipping and return options?',
    a: 'Standard shipping is $10 and free on orders over $100, with free local pickup in Tampa, FL. See our Shipping & Returns page for full details.',
  },
  {
    q: 'Do I need an account to order?',
    a: 'No. You can browse and check out as a guest. Creating an account simply lets you track orders and reorder faster.',
  },
];

// Placeholder testimonials — replace with verified customer reviews before launch.
const testimonials = [
  {
    quote:
      'The team helped me move from an all-round racket to a head-heavy frame and my smashes are noticeably steeper. Stringing was spot on.',
    name: 'Daniel R.',
    role: 'Club singles player',
  },
  {
    quote:
      'Easy to compare specs without the jargon. Found a lightweight racket for doubles and it arrived strung exactly how I asked.',
    name: 'Priya S.',
    role: 'Doubles player',
  },
  {
    quote:
      'Genuine frames, fair prices, and quick delivery. This is now my go-to shop for rackets and restrings.',
    name: 'Marcus L.',
    role: 'Weekend competitor',
  },
];

export default function Home() {
  const featured = listings.slice(0, 3);
  const comparison = listings.slice(0, 4).map((l) => ({ ...l, meta: getProductMeta(l) }));

  return (
    <main className={styles.main}>
      <Hero />

      {/* Selling points */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="What to look for"
            title="Built around how you play"
            subtitle="Every racket has a job. We make it easy to match the right frame to your game."
          />
          <div className={styles.pointsGrid}>
            {sellingPoints.map((point) => (
              <div key={point.title} className={styles.pointCard}>
                <span className={styles.pointIcon} aria-hidden="true">{point.icon}</span>
                <h3 className={styles.pointTitle}>{point.title}</h3>
                <p className={styles.pointText}>{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Shop by category"
            title="Find your fit, faster"
            subtitle="Jump straight to the rackets that match your style and level."
          />
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className={styles.categoryCard}>
                <div>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <span className={styles.categoryDesc}>{cat.desc}</span>
                </div>
                <svg className={styles.categoryArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured rackets */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featuredHead}>
            <SectionHeader
              eyebrow="Featured rackets"
              title="Player favorites"
              subtitle="A few standout frames to start your search."
              align="left"
            />
            <CTAButton href="/shop" variant="secondary" className={styles.viewAll}>
              View all rackets
            </CTAButton>
          </div>
          <div className={styles.featuredGrid}>
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Compare"
            title="Not sure which to pick?"
            subtitle="A side-by-side look at how our top frames differ, so you can choose with confidence."
          />
          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Racket</th>
                  <th>Play style</th>
                  <th>Level</th>
                  <th>Weight</th>
                  <th>Best for</th>
                  <th>Price</th>
                  <th><span className={styles.srOnly}>Action</span></th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Racket">
                      <span className={styles.compareName}>{item.title}</span>
                      <span className={styles.compareBrand}>{item.brand}</span>
                    </td>
                    <td data-label="Play style">{item.meta.style}</td>
                    <td data-label="Level">{item.meta.level}</td>
                    <td data-label="Weight">{item.specs.weight}</td>
                    <td data-label="Best for">{item.meta.benefit}</td>
                    <td data-label="Price"><strong>{item.price}</strong></td>
                    <td data-label="">
                      <Link href={`/listing/${item.id}`} className={styles.compareLink}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.compareFoot}>
            <CTAButton href="/guide" variant="outline">Read the buying guide</CTAButton>
          </div>
        </div>
      </section>

      {/* Guarantees / trust */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Why shop with us"
            title="Buy with total confidence"
          />
          <div className={styles.guaranteeGrid}>
            {guarantees.map((g) => (
              <div key={g.title} className={styles.guaranteeCard}>
                <span className={styles.guaranteeIcon} aria-hidden="true">{g.icon}</span>
                <h3 className={styles.guaranteeTitle}>{g.title}</h3>
                <p className={styles.guaranteeText}>{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="From the community"
            title="Loved by players"
          />
          <div className={styles.testimonialGrid}>
            {testimonials.map((t) => (
              <figure key={t.name} className={styles.testimonialCard}>
                <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
                <blockquote className={styles.testimonialQuote}>{t.quote}</blockquote>
                <figcaption className={styles.testimonialMeta}>
                  <span className={styles.testimonialName}>{t.name}</span>
                  <span className={styles.testimonialRole}>{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader eyebrow="FAQ" title="Questions, answered" />
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <details key={faq.q} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{faq.q}</summary>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Ready to find your next racket?</h2>
            <p className={styles.ctaSubtitle}>
              Browse the collection, customize your strings, and check out in minutes.
            </p>
            <div className={styles.ctaActions}>
              <CTAButton href="/shop" variant="accent" size="lg">Shop Rackets</CTAButton>
              <CTAButton href="/guide" variant="onDark" size="lg">Find your fit</CTAButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
