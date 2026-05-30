export default function SiteMark({ className, title = 'OfCourt' }) {
  return (
    <img
      className={className}
      src="/ofcourt.svg"
      alt={title}
      aria-hidden={title ? undefined : true}
    />
  );
}
