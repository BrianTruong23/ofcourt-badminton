import Link from 'next/link';
import styles from '../../styles/checkout.module.css';

const STEPS = [
  { id: 'bag', label: 'Bag', href: '/cart' },
  { id: 'checkout', label: 'Checkout', href: '/checkout' },
  { id: 'confirmation', label: 'Confirmation', href: '/receipt' },
];

export default function CheckoutStepper({ current = 'bag' }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav className={styles.stepperSteps} aria-label="Checkout progress">
      {STEPS.map((step, i) => {
        const isActive = step.id === current;
        const isPast = i < currentIndex;
        const isLink = isPast || (current === 'checkout' && step.id === 'bag');

        return (
          <span key={step.id} style={{ display: 'contents' }}>
            {i > 0 && <span className={styles.stepperSep} aria-hidden="true">&gt;</span>}
            {isLink ? (
              <Link
                href={step.href}
                className={`${styles.stepperStep} ${isActive ? styles.stepperStepActive : ''}`}
              >
                {step.label}
              </Link>
            ) : (
              <span
                className={`${styles.stepperStep} ${isActive ? styles.stepperStepActive : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {step.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
