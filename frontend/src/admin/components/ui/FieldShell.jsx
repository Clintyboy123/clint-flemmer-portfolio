// Label, optional hint and error around any control, wired up with aria-describedby.
// Labels and field text stay left-aligned on every screen size.
export function describedBy(id, hint, error) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
}

export default function FieldShell({ id, label, hint, error, required, optional, children, className = '' }) {
  return (
    <div className={`text-left ${className}`}>
      <label htmlFor={id} className="mb-2 flex items-baseline gap-2 text-ui font-semibold text-ink">
        {label}
        {required && (
          <span className="text-accent" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="text-meta font-normal text-muted">optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-meta text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-meta font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
