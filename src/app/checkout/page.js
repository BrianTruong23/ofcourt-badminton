'use client';

import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import styles from '../cart/cart.module.css';

const SHIPPING_COST = 10;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  // Contact Information
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState('shipping'); // 'shipping' or 'pickup'
  
  // Shipping Address
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [isShippingValid, setIsShippingValid] = useState(false);
  
  // Pickup Info
  const [pickupInfo, setPickupInfo] = useState({
    fullName: '',
    phoneNumber: ''
  });
  const [isPickupValid, setIsPickupValid] = useState(false);

  const shippingCost = deliveryMethod === 'shipping' ? 10 : 0;
  const orderTotal = cartTotal + shippingCost;

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    const valid = 
      shippingInfo.fullName.trim() !== '' &&
      shippingInfo.address.trim() !== '' &&
      shippingInfo.city.trim() !== '' &&
      shippingInfo.state.trim() !== '' &&
      shippingInfo.zipCode.trim() !== '';
    setIsShippingValid(valid);
  }, [shippingInfo]);

  useEffect(() => {
    const valid = 
      pickupInfo.fullName.trim() !== '' &&
      pickupInfo.phoneNumber.trim() !== '';
    setIsPickupValid(valid);
  }, [pickupInfo]);

  if (cart.length === 0) {
    return null;
  }

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePickupChange = (field, value) => {
    setPickupInfo(prev => ({ ...prev, [field]: value }));
  };

  const isDeliveryValid = deliveryMethod === 'shipping' ? isShippingValid : isPickupValid;
  const canProceedToPayment = isEmailValid && isDeliveryValid;

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
  };

  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: orderTotal }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const order = await response.json();
      if (!order.id) {
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
      // Save order to Supabase
      try {
        const createOrderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_email: email,
            customer_name: deliveryMethod === 'shipping' ? shippingInfo.fullName : pickupInfo.fullName,
            total_price: orderTotal,
            items: cart
          }),
        });
        
        if (!createOrderResponse.ok) {
          console.error('Failed to save order to database');
          // We don't block the user flow here since payment succeeded, 
          // but in a real app we'd want robust error handling/retries
        }
      } catch (err) {
        console.error('Error saving order:', err);
      }

      const orderData = {
        orderID: data.orderID,
        email: email,
        deliveryMethod: deliveryMethod,
        shipping: deliveryMethod === 'shipping' ? shippingInfo : null,
        pickup: deliveryMethod === 'pickup' ? pickupInfo : null,
        items: cart,
        subtotal: cartTotal,
        shippingCost: shippingCost,
        total: orderTotal,
        paymentMethod: 'PayPal',
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      clearCart();
      router.push('/receipt');
    }
  };

  const onError = (err) => {
    console.error('PayPal error:', err);
    alert('Payment failed. Please try again.');
  };

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
          </div>
        </div>
      </main>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#475569'
  };

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
            {/* Contact Information */}
            <div className={styles.cartItem} style={{ display: 'block', marginBottom: '24px' }}>
              <h2 className={styles.summaryTitle}>Contact Information</h2>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="email" style={labelStyle}>
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  style={inputStyle}
                />
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                  Order confirmation will be sent to this email
                </p>
              </div>
            </div>

            {/* Delivery Method */}
            <div className={styles.cartItem} style={{ display: 'block', marginBottom: '24px' }}>
              <h2 className={styles.summaryTitle}>Delivery Method</h2>
              
              <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="shipping"
                    checked={deliveryMethod === 'shipping'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: '600' }}>Shipping ($10)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: '600' }}>Pickup (Free)</span>
                </label>
              </div>

              {deliveryMethod === 'shipping' ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label htmlFor="fullName" style={labelStyle}>Full Name *</label>
                    <input
                      id="fullName"
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="address" style={labelStyle}>Street Address *</label>
                    <input
                      id="address"
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      placeholder="123 Main St"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label htmlFor="city" style={labelStyle}>City *</label>
                      <input
                        id="city"
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        placeholder="New York"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="state" style={labelStyle}>State *</label>
                      <input
                        id="state"
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        placeholder="NY"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" style={labelStyle}>ZIP Code *</label>
                      <input
                        id="zipCode"
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        placeholder="10001"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="country" style={labelStyle}>Country *</label>
                    <select
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      style={inputStyle}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{
                    padding: '12px 16px',
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    color: '#92400e',
                    fontSize: '0.9rem'
                  }}>
                    📍 <strong>FREE Pickup in Tampa!</strong> We'll contact you to arrange pickup.
                  </div>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <label htmlFor="pickupName" style={labelStyle}>Full Name *</label>
                      <input
                        id="pickupName"
                        type="text"
                        value={pickupInfo.fullName}
                        onChange={(e) => handlePickupChange('fullName', e.target.value)}
                        placeholder="John Doe"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" style={labelStyle}>Phone Number *</label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        value={pickupInfo.phoneNumber}
                        onChange={(e) => handlePickupChange('phoneNumber', e.target.value)}
                        placeholder="(555) 123-4567"
                        style={inputStyle}
                      />
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '8px' }}>
                        We'll call you when your order is ready for pickup
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Payment Method */}
            {canProceedToPayment && (
              <div className={styles.cartItem} style={{ display: 'block' }}>
                <h2 className={styles.summaryTitle}>Payment</h2>
                <p style={{ color: '#64748b', marginBottom: '16px' }}>
                  Pay securely with PayPal or Credit/Debit Card
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
                  No PayPal account required - you can pay with any credit or debit card
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
            )}

            {!canProceedToPayment && (
              <div style={{
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '8px',
                color: '#64748b',
                textAlign: 'center'
              }}>
                Please complete contact information and delivery method to continue
              </div>
            )}
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
              <span>{shippingCost === 0 ? 'Free (Pickup)' : `$${shippingCost}`}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>${orderTotal}</span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
