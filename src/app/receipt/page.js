'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../styles/checkout.module.css';

function formatCustomization(customization) {
  if (!customization) return null;
  const lines = [];
  if (customization.string) lines.push(`String: ${customization.string}`);
  if (customization.string !== 'Unstrung' && customization.tension) {
    lines.push(`Tension: ${customization.tension}`);
  }
  if (customization.stringColor) lines.push(`Color: ${customization.stringColor}`);
  if (customization.grip) lines.push(`Grip: ${customization.grip}`);
  return lines;
}

export default function ReceiptPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!orderData) {
    return (
      <div className={styles.shell}>
        <div className={styles.page}>
          <p className={styles.loading}>Loading your order...</p>
        </div>
      </div>
    );
  }

  const orderDate = new Date(orderData.timestamp);

  return (
    <div className={styles.shell}>
      <div className={`${styles.page} ${styles.pageNarrow}`}>
        <div className={styles.successHero}>
          <div className={styles.successIcon} aria-hidden="true">✓</div>
          <h1 className={styles.successTitle}>Thank you for your order</h1>
          <p className={styles.successDesc}>
            Your order has been placed successfully.
          </p>
          <p className={styles.successEmail}>
            Confirmation sent to {orderData.email}
          </p>
        </div>

        <div className={styles.receiptCard}>
          <div className={styles.receiptHeader}>
            <h2 className={styles.receiptHeading}>Order details</h2>
            <p className={styles.receiptMeta}>
              Order ID: {orderData.orderID}<br />
              {orderDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              at {orderDate.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className={styles.receiptSection}>
            <h3 className={styles.receiptSectionTitle}>Items</h3>
            {orderData.items.map((item) => {
              const meta = formatCustomization(item.customization);
              return (
                <div key={item.cartId} className={styles.receiptLineItem}>
                  <div>
                    <div className={styles.receiptItemName}>{item.title}</div>
                    {meta && meta.map((line) => (
                      <div key={line} className={styles.receiptItemMeta}>{line}</div>
                    ))}
                  </div>
                  <span className={styles.receiptItemPrice}>${item.totalPrice}</span>
                </div>
              );
            })}
          </div>

          {orderData.deliveryMethod && (
            <div className={styles.receiptSection}>
              <h3 className={styles.receiptSectionTitle}>
                {orderData.deliveryMethod === 'shipping' ? 'Shipping address' : 'Pickup details'}
              </h3>
              <div className={styles.infoBlock}>
                {orderData.deliveryMethod === 'shipping' && orderData.shipping ? (
                  <>
                    <div className={styles.infoBlockName}>{orderData.shipping.fullName}</div>
                    <div>{orderData.shipping.address}</div>
                    <div>
                      {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}
                    </div>
                    <div>{orderData.shipping.country}</div>
                  </>
                ) : orderData.pickup ? (
                  <>
                    <div className={styles.infoBlockName}>{orderData.pickup.fullName}</div>
                    <div>Phone: {orderData.pickup.phoneNumber}</div>
                    <div style={{ marginTop: 10, fontSize: '0.875rem', color: 'var(--ck-text-secondary)' }}>
                      Pickup location: Tampa, FL — we&apos;ll call when ready
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {orderData.paymentMethod && (
            <div className={styles.receiptSection}>
              <h3 className={styles.receiptSectionTitle}>Payment</h3>
              <div className={styles.infoBlock}>{orderData.paymentMethod}</div>
            </div>
          )}

          <div className={styles.receiptTotals}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${orderData.subtotal ?? orderData.total}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{orderData.shippingCost ? `$${orderData.shippingCost}` : 'Free'}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${orderData.total}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/shop" className={styles.primaryBtn}>
            Continue shopping
          </Link>
          <Link href="/" className={styles.secondaryBtn}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
