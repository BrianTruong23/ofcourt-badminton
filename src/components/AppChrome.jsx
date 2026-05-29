'use client';

import { usePathname } from 'next/navigation';
import CheckoutNav from './checkout/CheckoutNav';

const CHECKOUT_PATHS = ['/cart', '/checkout', '/receipt', '/success'];

const STEP_BY_PATH = {
  '/cart': 'bag',
  '/checkout': 'checkout',
  '/receipt': 'confirmation',
  '/success': 'confirmation',
};

export default function AppChrome({ children, navbar, footer }) {
  const pathname = usePathname();
  const isCheckout = CHECKOUT_PATHS.some((p) => pathname?.startsWith(p));

  if (isCheckout) {
    const current = STEP_BY_PATH[pathname] || 'bag';
    return (
      <>
        <CheckoutNav current={current} />
        {children}
      </>
    );
  }

  return (
    <>
      {navbar}
      {children}
      {footer}
    </>
  );
}
