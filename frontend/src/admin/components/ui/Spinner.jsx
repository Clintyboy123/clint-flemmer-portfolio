import { LoaderCircle } from 'lucide-react';

export default function Spinner({ className = 'size-5', label }) {
  return (
    <>
      <LoaderCircle className={`animate-spin motion-reduce:animate-none ${className}`} strokeWidth={1.75} aria-hidden="true" />
      {label && <span className="sr-only">{label}</span>}
    </>
  );
}
