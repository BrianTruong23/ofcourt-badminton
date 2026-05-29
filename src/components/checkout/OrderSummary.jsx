import Link from 'next/link';
import styles from '../../styles/checkout.module.css';

export default function OrderSummary({
  items = [],
  subtotal = 0,
  shippingCost = 0,
  total = 0,
  shippingLabel = 'Shipping',
  showItems = true,
  actionLabel,
  actionHref,
  onAction,
  helpText,
}) {
  return (
    <aside className={styles.summary}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>

      {showItems && items.length > 0 && (
        <div className={styles.summaryItems}>
          {items.map((item) => (
            <div key={item.cartId} className={styles.summaryItem}>
              <span className={styles.summaryItemName}>{item.title}</span>
              <span className={styles.summaryItemPrice}>${item.totalPrice}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <span>${subtotal}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>{shippingLabel}</span>
        <span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
      </div>
      <div className={styles.summaryTotal}>
        <span>Total</span>
        <span>${total}</span>
      </div>

      {actionLabel && actionHref && (
        <Link href={actionHref} className={styles.primaryBtn}>
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && !actionHref && (
        <button type="button" className={styles.primaryBtn} onClick={onAction}>
          {actionLabel}
        </button>
      )}

      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </aside>
  );
}
