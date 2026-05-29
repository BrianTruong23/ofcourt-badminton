/**
 * Reusable badminton racket illustration.
 * Renders an SVG line-art racket tinted with the provided color.
 */
export default function RacketIcon({ color = '#102A43', className, strokeWidth = 3 }) {
  return (
    <svg className={className} viewBox="0 0 90 230" fill="none" aria-hidden="true">
      {/* Head */}
      <ellipse cx="45" cy="56" rx="34" ry="48" stroke={color} strokeWidth={strokeWidth} />
      <ellipse cx="45" cy="56" rx="27" ry="40" stroke={color} strokeWidth={strokeWidth * 0.5} strokeOpacity="0.55" />
      {/* String bed */}
      <g stroke={color} strokeOpacity="0.32" strokeWidth="1.1">
        <line x1="31" y1="15" x2="31" y2="98" />
        <line x1="38" y1="11" x2="38" y2="101" />
        <line x1="45" y1="9" x2="45" y2="103" />
        <line x1="52" y1="11" x2="52" y2="101" />
        <line x1="59" y1="15" x2="59" y2="98" />
        <line x1="14" y1="36" x2="76" y2="36" />
        <line x1="11" y1="48" x2="79" y2="48" />
        <line x1="11" y1="60" x2="79" y2="60" />
        <line x1="14" y1="72" x2="76" y2="72" />
      </g>
      {/* Throat */}
      <path d="M33 96 L45 124 L57 96" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      {/* Shaft */}
      <rect x="42" y="122" width="6" height="78" rx="3" fill={color} />
      {/* Grip */}
      <rect x="38" y="184" width="14" height="40" rx="7" fill={color} />
      <g stroke={color} strokeOpacity="0.35" strokeWidth="1.1">
        <line x1="39" y1="192" x2="51" y2="188" />
        <line x1="39" y1="200" x2="51" y2="196" />
        <line x1="39" y1="208" x2="51" y2="204" />
        <line x1="39" y1="216" x2="51" y2="212" />
      </g>
    </svg>
  );
}
