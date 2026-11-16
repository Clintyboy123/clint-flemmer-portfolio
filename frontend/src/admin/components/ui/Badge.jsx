const base = 'inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-label font-semibold tracking-wide whitespace-nowrap';

const tones = {
  neutral: 'bg-soft text-muted',
  ink: 'bg-ink text-paper',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
};

export default function Badge({ tone = 'neutral', icon: Icon, children, className = '' }) {
  return (
    <span className={`${base} ${tones[tone]} ${className}`}>
      {Icon && <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />}
      {children}
    </span>
  );
}
