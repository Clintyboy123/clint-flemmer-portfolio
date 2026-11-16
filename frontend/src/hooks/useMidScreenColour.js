import { useEffect, useState } from 'react';
import { canHover } from '../utils/env';

// Touch screens have no hover, so project images turn from black & white to colour while they're mid-screen.
export default function useMidScreenColour(ref) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (canHover || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '-35% 0px -35% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return on;
}
