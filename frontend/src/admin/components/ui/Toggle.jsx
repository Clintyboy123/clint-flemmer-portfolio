import { useId } from 'react';

// An on/off switch. The whole row is the 44px tap target.
export default function Toggle({ label, hint, checked, onChange, disabled = false, className = '' }) {
  const id = useId();
  return (
    <div className={`flex items-center justify-between gap-4 text-left ${className}`}>
      <div>
        <span id={`${id}-label`} className="block text-ui font-semibold text-ink">
          {label}
        </span>
        {hint && (
          <span id={`${id}-hint`} className="mt-1 block text-meta text-muted">
            {hint}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="group inline-flex h-11 w-14 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span
          className={`relative h-7 w-12 rounded-full transition-colors duration-300 ease-out-soft ${checked ? 'bg-ink' : 'bg-line group-hover:bg-muted/40'}`}
        >
          <span
            className={`absolute top-1 left-1 size-5 rounded-full bg-paper transition-transform duration-300 ease-out-soft ${checked ? 'translate-x-5' : ''}`}
          />
        </span>
      </button>
    </div>
  );
}
