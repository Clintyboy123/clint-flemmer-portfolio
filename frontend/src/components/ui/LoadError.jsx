import { RotateCw } from 'lucide-react';

// On-brand error state with a retry: shown when the API can't be reached.
export default function LoadError({ error, onRetry, title = 'This didn’t load.' }) {
  return (
    <div className="wrap" role="alert">
      <div className="flex flex-col items-start gap-6 border-t border-ink py-16 max-[600px]:items-center max-[600px]:text-center">
        <p className="eyebrow">Something went wrong</p>
        <h2 className="text-[clamp(32px,4vw,48px)]">
          {title.replace(/[.!?]$/, '')}
          <span className="dot">{title.match(/[.!?]$/)?.[0] || '.'}</span>
        </h2>
        <p className="max-w-[44ch] text-ink-2">{error?.message || 'Please check your connection and try again.'}</p>
        <button type="button" className="btn btn--solid" onClick={onRetry}>
          Try again <RotateCw aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
