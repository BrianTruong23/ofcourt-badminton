'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductMeta } from '../app/data';
import RacketIcon from './RacketIcon';
import styles from '../app/listing/listing.module.css';

export default function ListingDetails({ listing }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const meta = getProductMeta(listing);

  const [customization, setCustomization] = useState({
    string: 'Unstrung',
    tension: '24 lbs',
    grip: 'Original',
    stringColor: 'White',
  });

  const basePrice = parseInt(listing.price.replace('$', ''), 10);

  const calculateTotal = () => {
    let total = basePrice;
    if (customization.string !== 'Unstrung') total += 15;
    if (customization.grip !== 'Original') total += 5;
    return total;
  };

  const handleAddToCart = () => {
    addToCart({
      ...listing,
      customization,
      totalPrice: calculateTotal(),
    });
    router.push('/cart');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/shop">Shop</Link>
          <span aria-hidden="true">/</span>
          <span>{listing.title}</span>
        </nav>

        <div className={styles.layout}>
          {/* Visual */}
          <div className={styles.gallery}>
            <div
              className={styles.stage}
              style={{
                background: `radial-gradient(70% 70% at 50% 35%, ${listing.color}1a, transparent 70%), linear-gradient(160deg, var(--cream-card), var(--cream-deep))`,
              }}
            >
              <span className={styles.galleryTag}>{listing.brand}</span>
              <RacketIcon color={listing.color || '#102A43'} className={styles.stageRacket} />
            </div>
            <p className={styles.galleryNote}>
              Product photography placeholder — replace with real racket images.
            </p>
          </div>

          {/* Buy box */}
          <div className={styles.buyColumn}>
            <span className={styles.series}>{listing.series}</span>
            <h1 className={styles.title}>{listing.title}</h1>

            <div className={styles.metaRow}>
              <span className={styles.metaPill}>{meta.style}</span>
              <span className={styles.metaPill}>{meta.level}</span>
              <span className={styles.metaPill}>{meta.weightClass}</span>
            </div>

            <p className={styles.benefit}>{meta.benefit}</p>

            <div className={styles.priceRow}>
              <span className={styles.price}>${calculateTotal()}</span>
              {calculateTotal() !== basePrice && (
                <span className={styles.priceBase}>Base ${basePrice}</span>
              )}
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>String (+$15)</label>
                <select
                  className={styles.select}
                  value={customization.string}
                  onChange={(e) => setCustomization({ ...customization, string: e.target.value })}
                >
                  <option value="Unstrung">Unstrung (frame only)</option>
                  <option value="BG65">Yonex BG65 — Durability</option>
                  <option value="BG80">Yonex BG80 — Power</option>
                  <option value="Exbolt 63">Yonex Exbolt 63 — Control</option>
                </select>
              </div>

              {customization.string !== 'Unstrung' && (
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tension</label>
                    <select
                      className={styles.select}
                      value={customization.tension}
                      onChange={(e) => setCustomization({ ...customization, tension: e.target.value })}
                    >
                      <option value="24 lbs">24 lbs (recommended)</option>
                      <option value="25 lbs">25 lbs</option>
                      <option value="26 lbs">26 lbs</option>
                      <option value="27 lbs">27 lbs</option>
                      <option value="28 lbs">28 lbs</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>String color</label>
                    <select
                      className={styles.select}
                      value={customization.stringColor}
                      onChange={(e) => setCustomization({ ...customization, stringColor: e.target.value })}
                    >
                      <option value="White">White</option>
                      <option value="Yellow">Yellow</option>
                      <option value="Orange">Orange</option>
                      <option value="Black">Black</option>
                    </select>
                  </div>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Grip (+$5)</label>
                <select
                  className={styles.select}
                  value={customization.grip}
                  onChange={(e) => setCustomization({ ...customization, grip: e.target.value })}
                >
                  <option value="Original">Original grip</option>
                  <option value="Super Grap">Yonex Super Grap (white)</option>
                  <option value="Towel Grip">Yonex Towel Grip (yellow)</option>
                </select>
              </div>
            </div>

            <button className={styles.addBtn} onClick={handleAddToCart}>
              Add to Cart — ${calculateTotal()}
            </button>

            <ul className={styles.assurances}>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                Free shipping over $100
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Secure checkout
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>
                Authentic, inspected frame
              </li>
            </ul>
          </div>
        </div>

        {/* Details */}
        <div className={styles.details}>
          <section className={styles.detailBlock}>
            <h2 className={styles.detailTitle}>Overview</h2>
            <p className={styles.overview}>{listing.description}</p>
          </section>

          <section className={styles.detailBlock}>
            <h2 className={styles.detailTitle}>Specifications</h2>
            <div className={styles.specsGrid}>
              {[
                ['Weight / Grip size', listing.specs.weight],
                ['Balance point', listing.specs.balance],
                ['Stiffness', listing.specs.stiffness],
                ['String tension', listing.specs.tension],
                ['Frame material', listing.specs.frame],
                ['Shaft material', listing.specs.shaft],
              ].map(([label, value]) => (
                <div key={label} className={styles.specItem}>
                  <span className={styles.specLabel}>{label}</span>
                  <span className={styles.specValue}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.detailBlock}>
            <h2 className={styles.detailTitle}>Technologies</h2>
            <ul className={styles.techList}>
              {listing.technologies.map((tech) => (
                <li key={tech} className={styles.techItem}>{tech}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
