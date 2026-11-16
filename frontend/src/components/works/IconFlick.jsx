import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIntro } from '../../context/IntroContext';
import { reduceMotion } from '../../utils/env';
import cx from '../../utils/cx';

// Works header: one large discipline icon on the right that flicks over (like a split-flap card) to the next
// discipline every 1.5 s, its name flipping underneath. Pauses while off screen or in a background tab.
const P = (d) => <path d={d} />;
const ICONS = [
  ['Graphic Design', <>{P('M8 40 30 18M30 18l6-6 4 4-6 6-4-4zM8 40l-2 4 4-2')}<circle cx="16" cy="14" r="8" /></>],
  ['Motion Graphics', <><rect x="5" y="11" width="38" height="26" rx="3" />{P('M20 18v12l10-6z')}</>],
  ['Video & Sound', P('M6 24h2M12 16v16M18 7v34M24 15v18M30 10v28M36 17v14M42 24h0')],
  ['Illustration', P('M10 38c6-2 8-8 14-10s10 2 14-4M34 8l6 6-18 18-8 2 2-8z')],
  ['Web Design', <><rect x="5" y="8" width="38" height="32" rx="3" />{P('M5 16h38M10 12h2M15 12h2M12 24l-4 4 4 4M36 24l4 4-4 4M27 22l-6 12')}</>],
  ['3D Design', P('M24 5 41 14.5v19L24 43 7 33.5v-19zM24 24v19M24 24 41 14.5M24 24 7 14.5')],
  ['2D Animation', <><circle cx="14" cy="30" r="8" /><circle cx="34" cy="18" r="8" strokeDasharray="3 3" />{P('M20 24c3-3 6-4 8-4')}</>],
  ['AI Creative', P('M21 7c1.6 8.4 4.6 11.4 13 13-8.4 1.6-11.4 4.6-13 13-1.6-8.4-4.6-11.4-13-13 8.4-1.6 11.4-4.6 13-13zM36 29c.8 3.6 2.2 5 5.8 5.8-3.6.8-5 2.2-5.8 5.8-.8-3.6-2.2-5-5.8-5.8 3.6-.8 5-2.2 5.8-5.8z')],
];
const OUT = { duration: 170, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' };
const IN = { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' };
const CARD_IN = [{ transform: 'perspective(560px) rotateX(-84deg) translateY(6%)', opacity: 0 }, { transform: 'perspective(560px) rotateX(0deg)', opacity: 1 }];
const CARD_OUT = [{ transform: 'perspective(560px) rotateX(0deg)', opacity: 1 }, { transform: 'perspective(560px) rotateX(84deg) translateY(-6%)', opacity: 0 }];

export default function IconFlick() {
  const { ready } = useIntro();
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const flick = useRef(null);
  const card = useRef(null);
  const label = useRef(null);
  const st = useRef({ timer: 0, visible: true, pendingIn: false, live: true });

  const schedule = () => {
    const s = st.current;
    clearTimeout(s.timer);
    if (s.live && s.visible && !document.hidden) s.timer = setTimeout(next, reduceMotion ? 2600 : 1500);
  };
  const next = async () => {
    const s = st.current;
    if (reduceMotion) await flick.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).finished;
    else
      await Promise.all([
        card.current.animate(CARD_OUT, OUT).finished,
        label.current.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-60%)', opacity: 0 }], OUT).finished,
      ]);
    if (!s.live) return;
    s.pendingIn = true;
    setI((n) => (n + 1) % ICONS.length);
  };

  // after the swap renders: flick the new card in from below, then queue the next one
  useLayoutEffect(() => {
    const s = st.current;
    if (!s.pendingIn) return;
    s.pendingIn = false;
    if (reduceMotion) flick.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' }).finished.then(schedule);
    else {
      card.current.animate(CARD_IN, IN);
      label.current.animate([{ transform: 'translateY(60%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { ...IN, delay: 40 });
      schedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  useEffect(() => {
    const s = st.current;
    s.live = true;
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      if (s.visible) schedule();
      else clearTimeout(s.timer);
    });
    io.observe(flick.current);
    const vis = () => (document.hidden ? clearTimeout(s.timer) : schedule());
    document.addEventListener('visibilitychange', vis);
    return () => {
      s.live = false;
      clearTimeout(s.timer);
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the first card flicks in once the header's own entrance has played
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      setShown(true);
      if (!reduceMotion) card.current.animate(CARD_IN, IN);
      schedule();
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div ref={flick} className={cx('flick', shown && 'is-in')} aria-hidden="true">
      <div ref={card} className="flick__card">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {ICONS[i][1]}
        </svg>
      </div>
      <p ref={label} className="flick__label">
        {ICONS[i][0]}
      </p>
    </div>
  );
}
