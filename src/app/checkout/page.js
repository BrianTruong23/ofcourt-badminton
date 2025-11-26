'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '../cart/cart.module.css'; // Reuse cart styles for layout

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to cart if empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    alert('Order placed successfully!');
    router.push('/');
  };

  if (cart.length === 0) {
    return null; // Return null while redirecting
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>Checkout</h1>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.cartGrid}>
          <form className={styles.cartItems} onSubmit={handleCheckout}>
            <div className={styles.cartItem} style={{ display: 'block' }}>
              <h2 className={styles.summaryTitle}>Shipping Information</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                />
                <input 
                  type="text" 
                  placeholder="Address" 
                  required
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="City" 
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Zip Code" 
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.cartItem} style={{ display: 'block' }}>
              <h2 className={styles.summaryTitle}>Payment Details</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <input 
                  type="text" 
                  placeholder="Card Number" 
                  required
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                  <input 
                    type="text" 
                    placeholder="CVC" 
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </form>

          <aside className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Items ({cart.length})</span>
              <span>${cartTotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>${cartTotal}</span>
            </div>
            <button 
              className={styles.checkoutBtn}
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
