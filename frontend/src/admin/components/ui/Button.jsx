import { Link } from 'react-router';
import Spinner from './Spinner';

// Pill buttons, like the public site. Pages pick a variant and size; class lists live here only.
const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold text-ui whitespace-nowrap transition-colors duration-300 ease-out-soft disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary: 'bg-ink text-paper hover:bg-accent disabled:hover:bg-ink',
  secondary: 'border border-line bg-paper text-ink hover:border-ink disabled:hover:border-line',
  ghost: 'text-ink hover:bg-soft',
  danger: 'bg-danger text-paper hover:bg-ink disabled:hover:bg-danger',
  'danger-ghost': 'text-danger hover:bg-danger/10',
};

const sizes = {
  md: 'h-12 px-6',
  sm: 'h-11 px-5',
};

export default function Button({ variant = 'primary', size = 'md', to, href, loading = false, disabled = false, icon: Icon, className = '', children, ...props }) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {loading ? <Spinner className="size-5" /> : Icon && <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" {...props} className={classes} disabled={loading || disabled} aria-busy={loading || undefined}>
      {content}
    </button>
  );
}
