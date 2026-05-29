'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/info.module.css';

const contactDetails = [
  {
    label: 'Email',
    value: 'support@ofcourt.com',
    href: 'mailto:support@ofcourt.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
    ),
  },
  {
    label: 'Phone',
    value: '(555) 012-3456',
    href: 'tel:+15550123456',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    ),
  },
  {
    label: 'Pickup location',
    value: 'Tampa, FL',
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
  },
  {
    label: 'Hours',
    value: 'Mon to Sat, 9am to 6pm ET',
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>
    ),
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${form.name || 'a player'}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`);
    window.location.href = `mailto:support@ofcourt.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.containerWide}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Contact</span>
          </nav>
          <span className={styles.eyebrow}>Get in touch</span>
          <h1 className={styles.title}>We are here to help</h1>
          <p className={styles.lede}>
            Questions about a racket, your order, or stringing? Reach out and a real
            person will get back to you.
          </p>
        </div>
      </header>

      <div className={styles.containerWide}>
        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <h2 className={styles.blockTitle}>Contact details</h2>
            <ul className={styles.contactList}>
              {contactDetails.map((item) => (
                <li key={item.label} className={styles.contactItem}>
                  <span className={styles.contactItemIcon} aria-hidden="true">{item.icon}</span>
                  <span>
                    <span className={styles.contactItemLabel}>{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className={styles.contactItemValue}>{item.value}</a>
                    ) : (
                      <span className={styles.contactItemValue}>{item.value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.contactCard}>
            <h2 className={styles.blockTitle}>Send a message</h2>
            {submitted ? (
              <div className={styles.success}>
                Thanks for reaching out. Your email client should now open with your
                message ready to send. We typically reply within one business day.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>Name</label>
                  <input id="name" type="text" className={styles.input} value={form.name} onChange={handleChange('name')} required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email</label>
                  <input id="email" type="email" className={styles.input} value={form.email} onChange={handleChange('email')} required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>How can we help?</label>
                  <textarea id="message" className={styles.textarea} value={form.message} onChange={handleChange('message')} required />
                </div>
                <button type="submit" className={styles.submitBtn}>Send message</button>
                <p className={styles.formNote}>We will never share your details. Replies within one business day.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
