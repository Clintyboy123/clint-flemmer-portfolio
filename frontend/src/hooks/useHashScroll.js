import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { reduceMotion } from '../utils/env';

// Hash links (/works#motion, /#about): once the page's content has rendered (ready = true), jump to the section,
// as a browser does when a page opens on an anchor. A later hash change on the same page scrolls smoothly.
// scrollIntoView respects each section's scroll-margin-top (the sticky bars), as the original anchors did.
export default function useHashScroll(ready) {
  const { hash, key } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (!ready || !hash) {
      if (ready) first.current = false;
      return;
    }
    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const smooth = !first.current && !reduceMotion;
    first.current = false;
    // a frame later, so layout (images with set sizes, fonts) has settled
    const raf = requestAnimationFrame(() => el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' }));
    return () => cancelAnimationFrame(raf);
  }, [ready, hash, key]);
}
