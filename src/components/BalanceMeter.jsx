/**
 * Badminton-specific balance diagram.
 * Renders a simplified racket axis (head -> grip) with a balance marker
 * positioned for head-heavy, even, or head-light frames.
 *
 * Colors inherit from `currentColor`; pass `markerColor` to accent the dot.
 */
export default function BalanceMeter({
  balance = 'even',
  markerColor,
  className,
}) {
  const x = balance === 'head' ? 24 : balance === 'light' ? 92 : 58;

  return (
    <svg
      className={className}
      viewBox="0 0 120 30"
      fill="none"
      aria-hidden="true"
    >
      {/* head */}
      <circle cx="16" cy="15" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="6" x2="16" y2="24" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="7" y1="15" x2="25" y2="15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      {/* shaft */}
      <line x1="26" y1="15" x2="104" y2="15" stroke="currentColor" strokeWidth="2" />
      {/* grip */}
      <rect x="104" y="9.5" width="13" height="11" rx="3.5" fill="currentColor" />
      {/* balance marker */}
      <line x1={x} y1="2" x2={x} y2="28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <circle cx={x} cy="15" r="5" fill={markerColor || 'currentColor'} />
    </svg>
  );
}
