const sizes = { md: 'text-section', lg: 'text-heading' };

export default function Wordmark({ size = 'md', className = '' }) {
  return (
    <span className={`${sizes[size]} font-extrabold tracking-heading text-ink ${className}`}>
      Clint<span className="text-accent">.</span>
    </span>
  );
}
