import { useCallback, useState } from 'react';

// Project images fade in once loaded ("is-loaded"); the soft tone behind them stays as the fallback.
// Returns [refCallback, loaded, onLoad] for an <img>.
export default function useLoaded() {
  const [loaded, setLoaded] = useState(false);
  const ref = useCallback((im) => {
    if (im && im.complete && im.naturalWidth) setLoaded(true);
  }, []);
  const onLoad = useCallback(() => setLoaded(true), []);
  return [ref, loaded, onLoad];
}
