import Link from 'next/link';
import Image from 'next/image';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import ListingCard from '../components/ListingCard';
import CTAButton from '../components/CTAButton';
import BalanceMeter from '../components/BalanceMeter';
import RacketFinder from '../components/RacketFinder';
import { listings, getProductMeta } from './data';
import styles from './page.module.css';

const BRANDS = ['Yonex', 'Victor', 'Li-Ning', 'FZ Forza', 'Apacs', 'Babolat'];

const playStyles = [
  {
    key: 'Power',
    balance: 'head',
    who: 'Back-court attackers who finish rallies with steep, heavy smashes.',
    specs: [
      ['Balance', 'Head-heavy'],
      ['Shaft', 'Stiff'],
      ['Weight', '3U-4U'],
      ['Tension', '24-28 lbs'],
    ],
    href: '/shop?style=Power',
  },
  {
    key: 'Speed',
    balance: 'light',
    who: 'Doubles players who win with fast drives, flat exchanges, and quick defense.',
    specs: [
      ['Balance', 'Head-light'],
      ['Shaft', 'Stiff'],
      ['Weight', '4U-5U'],
      ['Tension', '24-27 lbs'],
    ],
    href: '/shop?style=Speed',
  },
  {
    key: 'Control',
    balance: 'even',
    who: 'Net players and tacticians who place the shuttle exactly where they want it.',
    specs: [
      ['Balance', 'Even'],
      ['Shaft', 'Medium-stiff'],
      ['Weight', '3U-4U'],
      ['Tension', '23-26 lbs'],
    ],
    href: '/shop?style=Control',
  },
  {
    key: 'All-round',
    balance: 'even',
    who: 'Improving club players who want one dependable frame for every situation.',
    specs: [
      ['Balance', 'Even'],
      ['Shaft', 'Medium flex'],
      ['Weight', '4U'],
      ['Tension', '24-26 lbs'],
    ],
    href: '/shop?style=All-Round',
  },
];

const trust = [
  {
    title: 'Expert hand stringing',
    text: 'Pick your string and tension; every racket is strung by hand before it ships.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v16M9 4v16M14 4v16M19 4v16" /><path d="M4 8h15M4 13h15M4 18h15" />
      </svg>
    ),
  },
  {
    title: '100% authentic frames',
    text: 'Genuine rackets from Yonex, Victor, Li-Ning and FZ Forza, never marketplace fakes.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: 'Ships ready to play',
    text: 'Strung, gripped, and match-ready out of the box. Free shipping over $100.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Beginner to advanced',
    text: 'Real fitting help by play style, level, and budget. Guidance, not guesswork.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: 'Secure checkout',
    text: 'Pay safely with PayPal or any major card. No account required to order.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

const guides = [
  {
    title: 'How to choose a badminton racket',
    text: 'Balance, weight, and shaft stiffness, explained in plain language so you can buy with confidence.',
    read: '6 min read',
    href: '/guide',
  },
  {
    title: 'Head-heavy vs head-light',
    text: 'Why the balance point changes everything about your swing, your power, and your defense.',
    read: '4 min read',
    href: '/guide',
  },
  {
    title: '4U vs 5U: which weight?',
    text: 'How a few grams shift the trade-off between power, maneuverability, and control.',
    read: '3 min read',
    href: '/guide',
  },
  {
    title: 'Best rackets for fast doubles',
    text: 'Head-light frames built for flat drives, quick blocks, and lightning defense at the net.',
    read: '5 min read',
    href: '/shop?style=Speed',
  },
];

const testimonials = [
  {
    quote:
      'The team moved me from an all-round racket to a head-heavy frame and my smashes are noticeably steeper. Stringing was spot on.',
    name: 'Daniel R.',
    role: 'Club singles player',
    avatar: 'https://images.pexels.com/photos/4931356/pexels-photo-4931356.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    quote:
      'Easy to compare specs without the jargon. Found a light frame for doubles and it arrived strung exactly how I asked.',
    name: 'Priya S.',
    role: 'Doubles player',
    avatar: 'https://images.pexels.com/photos/8007497/pexels-photo-8007497.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    quote:
      'Genuine frames, fair prices, quick delivery. This is now my go-to shop for rackets and restrings.',
    name: 'Marcus L.',
    role: 'Weekend competitor',
    avatar: 'https://images.unsplash.com/flagged/photo-1572987337507-72aa40cac9e9?w=80&h=80&auto=format&fit=crop&q=80',
  },
];

const faqs = [
  {
    q: 'How do I choose the right racket?',
    a: 'Start with how you play. Power players suit head-heavy frames, fast doubles players prefer head-light and lighter rackets, and all-court players do best with even balance. Use the racket finder above, or read the buying guide. Every product page also lists the specs that matter.',
  },
  {
    q: 'Can I customize the string and tension?',
    a: 'Yes. On any product you can choose your string type, tension, grip, and string color. We string each racket by hand before it ships.',
  },
  {
    q: 'Which brands do you carry?',
    a: 'Established badminton brands such as Yonex, Victor, Li-Ning, and FZ Forza. Pro-grade frames only, never marketplace filler.',
  },
  {
    q: 'What are your shipping and return options?',
    a: 'Standard shipping is $10 and free on orders over $100, with free local pickup in Tampa, FL. See our Shipping & Returns page for full details.',
  },
  {
    q: 'Do I need an account to order?',
    a: 'No. You can browse and check out as a guest. An account simply lets you track orders and reorder faster.',
  },
];

export default function Home() {
  const featured = listings.slice(0, 3);
  const comparison = listings.slice(0, 4).map((l) => ({ ...l, meta: getProductMeta(l) }));

  return (
    <main className={styles.main}>
      <Hero />

      {/* ===== Brand authority ticker ===== */}
      <div className={styles.brandTicker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className={styles.tickerItem}>{brand}</span>
          ))}
        </div>
      </div>

      {/* ===== Shop by play style ===== */}
      <section id="play-style" className={styles.section}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Shop by play style"
            title="Find the frame that fits your game"
            subtitle="Every racket has a job. Start with how you play, and the specs that matter fall into place."
          />
          <div className={styles.styleGrid}>
            {playStyles.map((style, i) => (
              <Link key={style.key} href={style.href} className={styles.styleCard}>
                <div className={styles.styleTop}>
                  <span className={styles.styleNum}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.styleName}>{style.key}</h3>
                </div>
                <BalanceMeter balance={style.balance} markerColor="var(--sale-accent)" className={styles.styleMeter} />
                <p className={styles.styleWho}>{style.who}</p>
                <dl className={styles.styleSpecs}>
                  {style.specs.map(([label, value]) => (
                    <div key={label} className={styles.styleSpecRow}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <span className={styles.styleLink}>
                  Shop {style.key}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured rackets ===== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.featuredHead}>
            <SectionHeader
              eyebrow="Featured rackets"
              title="Player favorites"
              subtitle="A few standout frames to start your search, each with the specs that matter."
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

      {/* ===== Racket finder ===== */}
      <section id="finder" className={styles.finderSection}>
        <div className={styles.finderLines} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.finderHead}>
            <span className={styles.finderEyebrow}>The fitting room</span>
            <h2 className={styles.finderTitle}>Find your match in four questions</h2>
            <p className={styles.finderSub}>
              Answer like you would at the pro-shop counter. We&rsquo;ll match real frames
              to your game by balance, weight, stiffness, and level.
            </p>
          </div>
          <RacketFinder />
        </div>
      </section>

      {/* ===== Trust ===== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="The OfCourt promise"
            title="A real pro-shop, online"
          />
          <div className={styles.trustGrid}>
            {trust.map((t) => (
              <div key={t.title} className={styles.trustCard}>
                <span className={styles.trustIcon} aria-hidden="true">{t.icon}</span>
                <h3 className={styles.trustTitle}>{t.title}</h3>
                <p className={styles.trustText}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Compare ===== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <SectionHeader
            eyebrow="Compare"
            title="Top frames, side by side"
            subtitle="See how our most popular rackets differ across the specs that change how they play."
          />
          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Racket</th>
                  <th>Play style</th>
                  <th>Balance</th>
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
                    <td data-label="Balance">{item.specs.balance}</td>
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
        </div>
      </section>

      {/* ===== Editorial guide ===== */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.featuredHead}>
            <SectionHeader
              eyebrow="Knowledge"
              title="From the stringer's bench"
              subtitle="Plain-spoken advice from people who actually play. No SEO filler."
              align="left"
            />
            <CTAButton href="/guide" variant="secondary" className={styles.viewAll}>
              Read the full guide
            </CTAButton>
          </div>
          <div className={styles.guideGrid}>
            {guides.map((g, i) => (
              <Link key={g.title} href={g.href} className={styles.guideCard}>
                <span className={styles.guideIndex}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.guideBody}>
                  <span className={styles.guideKicker}>Guide &middot; {g.read}</span>
                  <h3 className={styles.guideTitle}>{g.title}</h3>
                  <p className={styles.guideText}>{g.text}</p>
                  <span className={styles.guideLink}>
                    Read guide
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <SectionHeader eyebrow="From the community" title="Players who found their frame" />
          <div className={styles.testimonialGrid}>
            {testimonials.map((t) => (
              <figure key={t.name} className={styles.testimonialCard}>
                <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
                <blockquote className={styles.testimonialQuote}>{t.quote}</blockquote>
                <figcaption className={styles.testimonialMeta}>
                  {t.avatar && (
                    <div className={styles.testimonialAvatar}>
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={44}
                        height={44}
                        className={styles.avatarImg}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div>
                    <span className={styles.testimonialName}>{t.name}</span>
                    <span className={styles.testimonialRole}>{t.role}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
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

      {/* ===== Final CTA ===== */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Ready to find your next racket?</h2>
            <p className={styles.ctaSubtitle}>
              Browse the collection, customize your strings, and check out in minutes.
            </p>
            <div className={styles.ctaActions}>
              <CTAButton href="/shop" variant="accent" size="lg">Shop rackets</CTAButton>
              <CTAButton href="#finder" variant="onDark" size="lg">Find your match</CTAButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
