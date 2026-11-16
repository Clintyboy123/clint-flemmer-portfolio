import { CircleAlert, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ error, onRetry, className = '' }) {
  return (
    <div role="alert" className={`flex flex-col items-center border-y border-line px-4 py-16 text-center ${className}`}>
      <CircleAlert className="mb-4 size-6 text-danger" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-lead font-semibold tracking-heading text-ink">This didn't load</p>
      <p className="mt-2 max-w-sm text-meta text-muted">{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RotateCcw} onClick={onRetry} className="mt-6">
          Try again
        </Button>
      )}
    </div>
  );
}
