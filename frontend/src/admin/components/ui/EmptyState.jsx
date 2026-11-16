// What will appear here, and what to do next.
export default function EmptyState({ icon: Icon, title, text, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center border-y border-line px-4 py-16 text-center ${className}`}>
      {Icon && <Icon className="mb-4 size-6 text-muted" strokeWidth={1.5} aria-hidden="true" />}
      <p className="text-lead font-semibold tracking-heading text-ink">{title}</p>
      {text && <p className="mt-2 max-w-sm text-meta text-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
