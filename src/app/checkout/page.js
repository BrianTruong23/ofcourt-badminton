'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import styles from '../cart/cart.module.css';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  if (cart.length === 0) {
    return null;
  }

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
  };

  const createOrder = async () => {
    try {
      console.log('Creating order for amount:', cartTotal);
      
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const order = await response.json();
      console.log('Order created:', order);
      
      if (!order.id) {
        console.error('No order ID in response:', order);
        throw new Error('Order ID missing from response');
      }
      
      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      alert(`Failed to create order: ${error.message}`);
      throw error;
    }
  };

  const onApprove = async (data) => {
    const response = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID }),
    });
    const details = await response.json();
    
    if (details.status === 'COMPLETED') {
      clearCart();
      router.push('/success');
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    alert('Payment failed. Please try again.');
  };

  // Show message if PayPal not configured
  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return (
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.container}>
            <h1 className={styles.title}>Checkout</h1>
          </div>
        </header>
        <div className={styles.container}>
          <div className={styles.emptyCart} style={{ padding: '80px 0' }}>
            <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>PayPal Not Configured</h2>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Please add your PayPal Client ID to <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>.env.local</code> to enable payments.
            </p>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              See <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>PAYPAL_SETUP.md</code> for instructions.
            </p>
          </div>
        </div>
      </main>
    );
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
          <div className={styles.cartItems}>
            <div className={styles.cartItem} style={{ display: 'block' }}>
              <h2 className={styles.summaryTitle}>Payment</h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Complete your purchase securely with PayPal
              </p>
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                  style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal',
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>

          <aside className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            {cart.map((item) => (
              <div key={item.cartId} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>${item.totalPrice}</div>
              </div>
            ))}
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
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
          </aside>
        </div>
      </div>
    </main>
  );
}
