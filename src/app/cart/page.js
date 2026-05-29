'use client';

import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import OrderSummary from '../../components/checkout/OrderSummary';
import styles from '../../styles/checkout.module.css';

export default function CartPage() {
  const { cart, removeFromCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className={styles.shell}>
        <div className={styles.page}>
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h1 className={styles.emptyTitle}>Your bag is empty</h1>
            <p className={styles.emptyDesc}>
              Browse our curated rackets and find the perfect match for your game.
            </p>
            <Link href="/shop" className={styles.primaryBtn} style={{ display: 'inline-flex', width: 'auto', marginTop: 0 }}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Review your bag</h1>
        <p className={styles.pageSubtitle}>
          {cart.length} {cart.length === 1 ? 'item' : 'items'} ready for checkout
        </p>

        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.itemList}>
              {cart.map((item) => (
                <article key={item.cartId} className={styles.item}>
                  <div
                    className={styles.itemThumb}
                    style={{ backgroundColor: item.color }}
                  >
                    {item.series}
                  </div>
                  <div className={styles.itemBody}>
                    <h2 className={styles.itemName}>{item.title}</h2>
                    {item.customization && (
                      <div className={styles.itemMeta}>
                        <span className={styles.itemMetaLine}>
                          String: {item.customization.string}
                        </span>
                        {item.customization.string !== 'Unstrung' && (
                          <>
                            <span className={styles.itemMetaLine}>
                              Tension: {item.customization.tension}
                            </span>
                            <span className={styles.itemMetaLine}>
                              Color: {item.customization.stringColor}
                            </span>
                          </>
                        )}
                        <span className={styles.itemMetaLine}>
                          Grip: {item.customization.grip}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className={styles.itemRemove}
                      onClick={() => removeFromCart(item.cartId)}
                    >
                      Remove
                    </button>
                  </div>
                  <span className={styles.itemPrice}>${item.totalPrice}</span>
                </article>
              ))}
            </div>
          </div>

          <OrderSummary
            items={cart}
            subtotal={cartTotal}
            shippingCost={0}
            total={cartTotal}
            shippingLabel="Estimated shipping"
            actionLabel="Check Out"
            actionHref="/checkout"
            helpText="Taxes and final shipping calculated at checkout."
          />
        </div>
      </div>
    </div>
  );
}
