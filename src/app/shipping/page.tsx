import styles from '../track-order/track-order.module.css'; // Reuse styles for consistency

export default function ShippingPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shipping Information</h1>
        <div className={styles.content}>
          <p className={styles.subtitle}>
            We ship to all 50 states in the US.
          </p>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--navy)' }}>Shipping Rates</h2>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--text-soft)' }}>
              <li style={{ marginBottom: '0.5rem' }}>Standard Shipping (3-5 business days): $10.00</li>
              <li style={{ marginBottom: '0.5rem' }}>Free Pickup in Tampa, FL</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--navy)' }}>Delivery Times</h2>
            <p style={{ color: 'var(--text-soft)', lineHeight: '1.6' }}>
              Orders are processed within 1-2 business days. Delivery times depend on your location and the shipping method selected.
              You will receive a tracking number via email once your order ships.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
