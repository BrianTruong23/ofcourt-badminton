import styles from './SectionHeader.module.css';

/**
 * Reusable section heading with optional eyebrow label and subtitle.
 * align: 'center' | 'left'
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}) {
  return (
    <div className={`${styles.header} ${align === 'left' ? styles.left : styles.center}`}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
