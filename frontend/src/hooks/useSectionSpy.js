import { useEffect, useState } from 'react';

// Scroll-spy: the id of the section currently crossing the middle of the screen
// (same band as the original: 45% from the top, 50% from the bottom). Watches main sections and the footer.
export default function useSectionSpy(enabled = true, deps = []) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    document.querySelectorAll('main section[id], footer[id]').forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      setActive(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);
  return active;
}
