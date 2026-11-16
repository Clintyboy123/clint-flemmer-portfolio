import { useCallback, useRef, useState } from 'react';

// Counts uploads in progress inside a form so Save (and closing) wait for them.
export default function useUploadCount(onChange) {
  const count = useRef(0);
  const [busy, setBusy] = useState(false);
  const track = useCallback(
    (uploading) => {
      count.current = Math.max(0, count.current + (uploading ? 1 : -1));
      const next = count.current > 0;
      setBusy(next);
      onChange?.(next);
    },
    [onChange]
  );
  return [busy, track];
}
