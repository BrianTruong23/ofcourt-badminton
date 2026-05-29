import Link from 'next/link';
import styles from './CTAButton.module.css';

/**
 * Shared call-to-action button used across the site.
 * Renders a Next.js Link when `href` is provided, otherwise a native button.
 * Variants: primary | secondary | ghost. Sizes: md | lg.
 */
export default function CTAButton({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...rest
}) {
  const classes = [styles.btn, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
