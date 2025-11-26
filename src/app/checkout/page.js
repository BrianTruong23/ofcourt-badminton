'use client';

import { useCart } from '@/context/CartContext';
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
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal' or 'card'
  
  // Credit Card Info
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isCardValid, setIsCardValid] = useState(false);

  const orderTotal = cartTotal + SHIPPING_COST;

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
    const cardNumberValid = cardInfo.cardNumber.replace(/\s/g, '').length === 16;
    const expiryValid = /^\d{2}\/\d{2}$/.test(cardInfo.expiryDate);
    const cvvValid = /^\d{3,4}$/.test(cardInfo.cvv);
    const nameValid = cardInfo.cardholderName.trim() !== '';
    setIsCardValid(cardNumberValid && expiryValid && cvvValid && nameValid);
  }, [cardInfo]);

  if (cart.length === 0) {
    return null;
  }

  const handleShippingChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field, value) => {
    if (field === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardInfo(prev => ({ ...prev, [field]: formatted }));
    } else if (field === 'expiryDate') {
      // Format MM/YY
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
      }
      setCardInfo(prev => ({ ...prev, [field]: formatted }));
    } else {
      setCardInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCreditCardSubmit = () => {
    if (!isEmailValid || !isShippingValid || !isCardValid) {
      alert('Please fill in all required fields');
      return;
    }

    // Store order details
    const orderData = {
      orderID: 'ORDER-' + Date.now(),
      email: email,
      shipping: shippingInfo,
      items: cart,
      subtotal: cartTotal,
      shippingCost: SHIPPING_COST,
      total: orderTotal,
      paymentMethod: 'Credit Card',
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    clearCart();
    router.push('/receipt');
  };

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
      const orderData = {
        orderID: data.orderID,
        email: email,
        shipping: shippingInfo,
        items: cart,
        subtotal: cartTotal,
        shippingCost: SHIPPING_COST,
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

  const canProceedToPayment = isEmailValid && isShippingValid;

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && paymentMethod === 'paypal') {
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
            </div>

            {/* Payment Method */}
            {canProceedToPayment && (
              <div className={styles.cartItem} style={{ display: 'block' }}>
                <h2 className={styles.summaryTitle}>Payment Method</h2>
                
                <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontWeight: '600' }}>PayPal</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontWeight: '600' }}>Credit Card</span>
                  </label>
                </div>

                {paymentMethod === 'paypal' ? (
                  <>
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
                  </>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                      <label htmlFor="cardNumber" style={labelStyle}>Card Number *</label>
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label htmlFor="expiryDate" style={labelStyle}>Expiry Date *</label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={cardInfo.expiryDate}
                          onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength="5"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" style={labelStyle}>CVV *</label>
                        <input
                          id="cvv"
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) => handleCardChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength="4"
                          style={inputStyle}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardholderName" style={labelStyle}>Cardholder Name *</label>
                      <input
                        id="cardholderName"
                        type="text"
                        value={cardInfo.cardholderName}
                        onChange={(e) => handleCardChange('cardholderName', e.target.value)}
                        placeholder="John Doe"
                        style={inputStyle}
                      />
                    </div>
                    <button
                      onClick={handleCreditCardSubmit}
                      disabled={!isCardValid}
                      className={styles.checkoutBtn}
                      style={{
                        opacity: isCardValid ? 1 : 0.5,
                        cursor: isCardValid ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Complete Purchase
                    </button>
                  </div>
                )}
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
              <span>${SHIPPING_COST}</span>
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
