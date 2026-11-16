import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSite } from './SiteContext';
import { reduceMotion } from '../utils/env';

// PRELOADER + PAGE TRANSITION (the original's intro, rebuilt for a single-page app).
//  · First visit of the session: white screen with a red loading bar (at least 950 ms, and until the site content
//    and fonts are ready), then the curtain lifts.
//  · Every page change afterwards (and a reload later in the session): a quick white curtain (250 ms) that lifts
//    off the new page, exactly like the old page-to-page load.
// While it covers the page, <body> has "is-loading" (no scrolling; rail, music and WhatsApp wait).
// "ready" = the curtain has lifted; "revealed" = the first-screen entrances (class "load") may play.
const IntroContext = createContext({ ready: false, revealed: false, cycle: 0, quick: false });

const seenBefore = () => {
  try {
    const seen = sessionStorage.getItem('intro') === '1';
    sessionStorage.setItem('intro', '1');
    return seen;
  } catch {
    return false;
  }
};

// read once per page load (not inside render: StrictMode would run it twice)
const SEEN = seenBefore();

export function IntroProvider({ children }) {
  const { pathname } = useLocation();
  const { loading } = useSite();
  const [s, setS] = useState(() => ({ path: pathname, cycle: 0, quick: SEEN, ready: false, revealed: false, t0: performance.now() }));

  // A new page: cover it again in the same render, so the new page never shows its finished state first.
  if (s.path !== pathname) setS({ path: pathname, cycle: s.cycle + 1, quick: true, ready: false, revealed: false, t0: performance.now() });

  // page change: start the new page at the top, before it paints (a #hash target is scrolled to by the page)
  useLayoutEffect(() => {
    if (s.cycle === 0) return;
    document.body.classList.add('is-loading');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [s.cycle]);

  useEffect(() => {
    if (s.cycle === 0 && loading) return; // the first lift waits for the site content
    let live = true;
    const timers = [];
    const minTime = reduceMotion ? 0 : s.quick ? 250 : 950;
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      if (!live) return;
      timers.push(
        setTimeout(() => {
          document.body.classList.remove('is-loading');
          setS((p) => ({ ...p, ready: true }));
          window.dispatchEvent(new Event('site:ready'));
          timers.push(setTimeout(() => setS((p) => ({ ...p, revealed: true })), reduceMotion ? 0 : s.quick ? 150 : 350));
        }, Math.max(0, minTime - (performance.now() - s.t0)))
      );
    });
    return () => {
      live = false;
      timers.forEach(clearTimeout);
    };
  }, [s.cycle, s.quick, s.t0, loading]);

  return <IntroContext.Provider value={s}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
