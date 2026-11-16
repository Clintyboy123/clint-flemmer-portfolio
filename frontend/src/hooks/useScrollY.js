import { useEffect, useRef } from 'react';

// Calls fn(scrollY) on scroll (at most once per frame) and once straight away.
export default function useScrollY(fn, deps = []) {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    let ticking = false;
    const run = () => {
      ticking = false;
      cb.current(window.scrollY);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    run();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
