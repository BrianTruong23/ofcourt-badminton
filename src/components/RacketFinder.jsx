'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { listings, getProductMeta } from '../app/data';
import RacketIcon from './RacketIcon';
import BalanceMeter from './BalanceMeter';
import styles from './RacketFinder.module.css';

const STEPS = [
  {
    key: 'play',
    label: 'How do you play?',
    options: [
      { value: 'singles', label: 'Mostly singles' },
      { value: 'doubles', label: 'Mostly doubles' },
      { value: 'both', label: 'A bit of both' },
    ],
  },
  {
    key: 'want',
    label: 'What do you want more of?',
    options: [
      { value: 'power', label: 'Power' },
      { value: 'speed', label: 'Speed' },
      { value: 'control', label: 'Control' },
    ],
  },
  {
    key: 'weight',
    label: 'Preferred weight?',
    options: [
      { value: 'light', label: 'Lighter (4U)' },
      { value: 'heavy', label: 'Heavier (3U)' },
      { value: 'any', label: 'No preference' },
    ],
  },
  {
    key: 'level',
    label: 'Current level?',
    options: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced / competitive' },
    ],
  },
];

const WANT_TO_STYLE = { power: 'Power', speed: 'Speed', control: 'Control' };

function scoreListing(listing, answers) {
  const meta = getProductMeta(listing);
  let score = 0;

  const targetStyle = WANT_TO_STYLE[answers.want];
  if (meta.style === targetStyle) score += 4;
  if (meta.style === 'All-Round') score += 2;

  if (answers.weight === 'light' && meta.weightClass === 'Lightweight') score += 2;
  if (answers.weight === 'heavy' && meta.weightClass === 'Standard') score += 2;
  if (answers.weight === 'any') score += 1;

  if (answers.level === 'advanced') {
    if (meta.level === 'Advanced') score += 3;
  } else if (answers.level === 'intermediate') {
    if (meta.level === 'Intermediate') score += 3;
  } else if (answers.level === 'beginner') {
    if (meta.level === 'Intermediate') score += 2;
    if (meta.level === 'Advanced') score -= 2;
  }

  if (answers.play === 'doubles' && meta.style === 'Speed') score += 2;
  if (answers.play === 'singles' && (meta.style === 'Power' || meta.style === 'Control')) score += 1;

  return { listing, meta, score };
}

function buildReason(meta, listing, answers) {
  const balance = listing.specs?.balance || meta.style;
  const weight = listing.specs?.weight || '';
  const playWord =
    answers.play === 'doubles'
      ? 'fast doubles'
      : answers.play === 'singles'
      ? 'singles'
      : 'all-court play';
  return `${balance}, ${weight.split('(')[0].trim()} frame tuned for ${answers.want}. A strong fit for ${playWord} at ${answers.level} level.`;
}

export default function RacketFinder() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

  const complete = STEPS.every((s) => answers[s.key]);

  const results = useMemo(() => {
    if (!submitted || !complete) return [];
    return listings
      .map((l) => scoreListing(l, answers))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const pa = parseInt(String(a.listing.price).replace(/[^0-9]/g, ''), 10) || 0;
        const pb = parseInt(String(b.listing.price).replace(/[^0-9]/g, ''), 10) || 0;
        return pa - pb;
      })
      .slice(0, 3);
  }, [submitted, complete, answers]);

  const select = (stepKey, value) => {
    setAnswers((prev) => ({ ...prev, [stepKey]: value }));
    setSubmitted(false);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setAddedId(null);
  };

  const handleAdd = (listing) => {
    const basePrice = parseInt(String(listing.price).replace(/[^0-9.]/g, ''), 10) || 0;
    addToCart({
      ...listing,
      customization: { string: 'Unstrung', tension: '24 lbs', grip: 'Original', stringColor: 'White' },
      totalPrice: basePrice,
    });
    setAddedId(listing.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  return (
    <div className={styles.finder}>
      <div className={styles.questions}>
        {STEPS.map((step, i) => (
          <fieldset key={step.key} className={styles.step}>
            <legend className={styles.stepLegend}>
              <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
              {step.label}
            </legend>
            <div className={styles.options}>
              {step.options.map((opt) => {
                const active = answers[step.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.option} ${active ? styles.optionActive : ''}`}
                    onClick={() => select(step.key, opt.value)}
                    aria-pressed={active}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.submitBtn}
            disabled={!complete}
            onClick={() => setSubmitted(true)}
          >
            {complete ? 'See my rackets' : 'Answer all four to continue'}
          </button>
          {(submitted || Object.keys(answers).length > 0) && (
            <button type="button" className={styles.resetBtn} onClick={reset}>
              Start over
            </button>
          )}
        </div>
      </div>

      {submitted && complete && (
        <div className={styles.results}>
          <p className={styles.resultsLead}>
            Based on your answers, these frames fit your game:
          </p>
          <div className={styles.resultGrid}>
            {results.map(({ listing, meta }, idx) => (
              <article key={listing.id} className={styles.resultCard}>
                {idx === 0 && <span className={styles.topPick}>Top match</span>}
                <Link href={`/listing/${listing.id}`} className={styles.resultMedia} aria-label={`View ${listing.title}`}>
                  <RacketIcon color={listing.color || '#102A43'} className={styles.resultRacket} />
                </Link>
                <div className={styles.resultBody}>
                  <span className={styles.resultBrand}>{listing.brand}</span>
                  <h4 className={styles.resultName}>
                    <Link href={`/listing/${listing.id}`}>{listing.title}</Link>
                  </h4>
                  <div className={styles.resultBalance}>
                    <BalanceMeter
                      balance={meta.style === 'Power' ? 'head' : meta.style === 'Speed' ? 'light' : 'even'}
                      markerColor="var(--sale-accent)"
                      className={styles.resultMeter}
                    />
                  </div>
                  <p className={styles.resultReason}>{buildReason(meta, listing, answers)}</p>
                  <ul className={styles.resultSpecs}>
                    {[listing.specs?.weight, listing.specs?.stiffness, listing.specs?.tension]
                      .filter(Boolean)
                      .map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                  </ul>
                  <div className={styles.resultFoot}>
                    <span className={styles.resultPrice}>{listing.price}</span>
                    <div className={styles.resultCta}>
                      <Link href={`/listing/${listing.id}`} className={styles.resultView}>
                        View details
                      </Link>
                      <button type="button" className={styles.resultAdd} onClick={() => handleAdd(listing)}>
                        {addedId === listing.id ? 'Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
