// Placeholder rows shaped like the list that is loading, so nothing jumps when it arrives.
export function SkeletonBar({ className = '' }) {
  return <span className={`block animate-pulse rounded-full bg-soft motion-reduce:animate-none ${className}`} />;
}

export default function SkeletonRows({ rows = 4, thumb = false, label = 'Loading' }) {
  return (
    <div role="status" aria-label={label} className="divide-y divide-line border-y border-line">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex flex-col items-center gap-4 py-6 md:flex-row">
          {thumb && <span className="block size-16 shrink-0 animate-pulse rounded-lg bg-soft motion-reduce:animate-none" />}
          <div className="flex w-full flex-col items-center gap-2 md:items-start">
            <SkeletonBar className="h-4 w-1/3" />
            <SkeletonBar className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
