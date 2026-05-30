'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProductMeta } from '../app/data';
import RacketIcon from './RacketIcon';
import styles from '../app/customize/customize.module.css';

export default function CustomizeForm({ listing }) {
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
          <Link href={`/listing/${listing.id}`}>{listing.title}</Link>
          <span aria-hidden="true">/</span>
          <span>Customize</span>
        </nav>

        <div className={styles.grid}>
          <div className={styles.imageSection}>
            <div
              className={styles.stage}
              style={{
                background: `radial-gradient(70% 70% at 50% 35%, ${listing.color}1a, transparent 70%), linear-gradient(160deg, var(--cream-card), var(--cream-deep))`,
              }}
            >
              <RacketIcon color={listing.color || '#427AB5'} className={styles.stageRacket} />
            </div>
            <div className={styles.quickSpecs}>
              <h3 className={styles.quickTitle}>Quick specs</h3>
              {[
                ['Weight', listing.specs.weight],
                ['Balance', listing.specs.balance],
                ['Stiffness', listing.specs.stiffness],
              ].map(([label, value]) => (
                <div key={label} className={styles.specRow}>
                  <span className={styles.specLabel}>{label}</span>
                  <span className={styles.specValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.configurator}>
            <span className={styles.series}>{listing.series}</span>
            <h1 className={styles.title}>{listing.title}</h1>
            <div className={styles.metaRow}>
              <span className={styles.metaPill}>{meta.style}</span>
              <span className={styles.metaPill}>{meta.level}</span>
            </div>
            <span className={styles.price}>${calculateTotal()}</span>

            <div className={styles.optionsGrid}>
              <div className={styles.optionGroup}>
                <label className={styles.label}>String option (+$15)</label>
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
                <>
                  <div className={styles.optionGroup}>
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
                  <div className={styles.optionGroup}>
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
                </>
              )}

              <div className={styles.optionGroup}>
                <label className={styles.label}>Grip option (+$5)</label>
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

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Add to Cart — ${calculateTotal()}
            </button>
            <p className={styles.note}>Free shipping on orders over $100 · Strung by hand before dispatch</p>
          </div>
        </div>
      </div>
    </main>
  );
}
