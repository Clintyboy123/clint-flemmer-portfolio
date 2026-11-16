// A 44px round button holding a single icon. `label` is required: it is the accessible name.
const base =
  'inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ease-out-soft disabled:cursor-not-allowed disabled:opacity-30';

const variants = {
  default: 'text-ink hover:bg-soft disabled:hover:bg-transparent',
  danger: 'text-muted hover:bg-danger/10 hover:text-danger disabled:hover:bg-transparent disabled:hover:text-muted',
};

export default function IconButton({ icon: Icon, label, variant = 'default', className = '', ...props }) {
  return (
    <button type="button" aria-label={label} title={label} {...props} className={`${base} ${variants[variant]} ${className}`}>
      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
