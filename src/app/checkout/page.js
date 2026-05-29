'use client';

import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../../context/AuthContext';
import OrderSummary from '../../components/checkout/OrderSummary';
import styles from '../../styles/checkout.module.css';

const SHIPPING_COST = 10;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('shipping');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [isShippingValid, setIsShippingValid] = useState(false);
  const [pickupInfo, setPickupInfo] = useState({
    fullName: '',
    phoneNumber: '',
  });
  const [isPickupValid, setIsPickupValid] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const shippingCost = deliveryMethod === 'shipping' ? SHIPPING_COST : 0;
  const orderTotal = cartTotal + shippingCost;

  useEffect(() => {
    if (user) setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (cart.length === 0 && !isOrderPlaced) {
      router.push('/cart');
    }
  }, [cart, router, isOrderPlaced]);

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

  if (cart.length === 0 && !isOrderPlaced) return null;

  const handleShippingChange = (field, value) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePickupChange = (field, value) => {
    setPickupInfo((prev) => ({ ...prev, [field]: value }));
  };

  const isDeliveryValid = deliveryMethod === 'shipping' ? isShippingValid : isPickupValid;
  const canProceedToPayment = isEmailValid && isDeliveryValid;

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
  };

  const createOrder = async () => {
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
    if (!order.id) throw new Error('Order ID missing from response');
    return order.id;
  };

  const onError = () => {
    alert('Payment failed. Please try again.');
  };

  const onApprove = async (data) => {
    const response = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderID: data.orderID }),
    });
    const details = await response.json();

    if (details.status === 'COMPLETED') {
      setIsOrderPlaced(true);

      try {
        await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_email: user ? user.email : email,
            customer_name:
              user?.user_metadata?.full_name ||
              user?.user_metadata?.name ||
              (deliveryMethod === 'shipping' ? shippingInfo.fullName : pickupInfo.fullName),
            total_price: orderTotal,
            items: cart,
          }),
        });
      } catch (err) {
        console.error('Error saving order:', err);
      }

      const orderData = {
        orderID: data.orderID,
        email,
        deliveryMethod,
        shipping: deliveryMethod === 'shipping' ? shippingInfo : null,
        pickup: deliveryMethod === 'pickup' ? pickupInfo : null,
        items: cart,
        subtotal: cartTotal,
        shippingCost,
        total: orderTotal,
        paymentMethod: 'PayPal',
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      clearCart();
      setTimeout(() => router.push('/receipt'), 1800);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className={styles.shell}>
        <div className={styles.page}>
          <div className={styles.processing}>
            <div className={styles.processingSpinner} aria-hidden="true" />
            <h1 className={styles.processingTitle}>Processing your order</h1>
            <p className={styles.processingDesc}>
              Thank you. Redirecting to your confirmation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Checkout</h1>
        <p className={styles.pageSubtitle}>
          Complete your details below to place your order.
        </p>

        <div className={styles.layout}>
          <div className={styles.main}>
            {/* Contact */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Contact</h2>
              <p className={styles.sectionDesc}>
                We&apos;ll send your order confirmation here.
              </p>
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Email address
                </label>
                {user ? (
                  <div className={`${styles.input} ${styles.inputReadonly}`}>
                    {user.email}
                  </div>
                ) : (
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={styles.input}
                    required
                  />
                )}
              </div>
            </section>

            {/* Delivery */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Delivery</h2>
              <p className={styles.sectionDesc}>
                Choose how you&apos;d like to receive your order.
              </p>

              <div className={styles.optionGroup}>
                <div className={styles.optionCard}>
                  <input
                    type="radio"
                    id="delivery-shipping"
                    name="deliveryMethod"
                    value="shipping"
                    checked={deliveryMethod === 'shipping'}
                    onChange={() => setDeliveryMethod('shipping')}
                    className={styles.optionInput}
                  />
                  <label htmlFor="delivery-shipping" className={styles.optionLabel}>
                    <span className={styles.optionCheck} aria-hidden="true" />
                    <span className={styles.optionTitle}>Standard shipping</span>
                    <span className={styles.optionPrice}>$10 · 3–5 business days</span>
                  </label>
                </div>
                <div className={styles.optionCard}>
                  <input
                    type="radio"
                    id="delivery-pickup"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                    className={styles.optionInput}
                  />
                  <label htmlFor="delivery-pickup" className={styles.optionLabel}>
                    <span className={styles.optionCheck} aria-hidden="true" />
                    <span className={styles.optionTitle}>Free pickup</span>
                    <span className={styles.optionPrice}>Tampa, FL</span>
                  </label>
                </div>
              </div>

              {deliveryMethod === 'shipping' ? (
                <>
                  <div className={styles.field}>
                    <label htmlFor="fullName" className={styles.label}>Full name</label>
                    <input
                      id="fullName"
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      placeholder="First and last name"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="address" className={styles.label}>Street address</label>
                    <input
                      id="address"
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label htmlFor="city" className={styles.label}>City</label>
                      <input
                        id="city"
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="state" className={styles.label}>State</label>
                      <input
                        id="state"
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="zipCode" className={styles.label}>ZIP code</label>
                      <input
                        id="zipCode"
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="country" className={styles.label}>Country</label>
                    <select
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      className={styles.select}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.notice}>
                    <span className={styles.noticeIcon} aria-hidden="true">📍</span>
                    <span>
                      <strong>Free pickup in Tampa.</strong> We&apos;ll contact you to arrange a convenient time.
                    </span>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="pickupName" className={styles.label}>Full name</label>
                    <input
                      id="pickupName"
                      type="text"
                      value={pickupInfo.fullName}
                      onChange={(e) => handlePickupChange('fullName', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="phoneNumber" className={styles.label}>Phone number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={pickupInfo.phoneNumber}
                      onChange={(e) => handlePickupChange('phoneNumber', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={styles.input}
                    />
                    <p className={styles.fieldHint}>
                      We&apos;ll call when your order is ready for pickup.
                    </p>
                  </div>
                </>
              )}
            </section>

            {/* Payment */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment</h2>
              {canProceedToPayment ? (
                <>
                  <p className={styles.paymentNote}>
                    Pay securely with PayPal or any credit or debit card. No PayPal account required.
                  </p>
                  <div className={styles.paymentWrap}>
                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        style={{
                          layout: 'vertical',
                          color: 'blue',
                          shape: 'pill',
                          label: 'paypal',
                          height: 48,
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </>
              ) : (
                <div className={styles.blockedNote}>
                  Please complete your contact and delivery details to continue to payment.
                </div>
              )}
            </section>
          </div>

          <OrderSummary
            items={cart}
            subtotal={cartTotal}
            shippingCost={shippingCost}
            total={orderTotal}
            shippingLabel={deliveryMethod === 'pickup' ? 'Pickup' : 'Shipping'}
            helpText="All prices in USD. Payment processed securely via PayPal."
          />
        </div>
      </div>
    </div>
  );
}
