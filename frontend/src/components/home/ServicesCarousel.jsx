import { useCallback, useEffect, useRef, useState } from 'react';
import { useContent, useSite } from '../../context/SiteContext';
import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';
import ServiceSlide from './ServiceSlide';
import { pad2, reduceMotion } from '../../utils/env';
import cx from '../../utils/cx';

// SERVICES CAROUSEL: a scroll-snap track that runs off the right edge so the next slide peeks in.
// Arrows, a 01 / 06 counter and a red progress line sit opposite the heading. Drag with the mouse (touch swipes
// natively), or tab to the track and use the arrow keys. The arrows grey out at each end.
export default function ServicesCarousel() {
  const c = useContent('home.services');
  const { services } = useSite();
  const track = useRef(null);
  const [nav, setNav] = useState({ index: 1, progress: 0.08, atStart: true, atEnd: false });
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ down: null, moved: false });
  const total = services.length;

  const stepW = useCallback(() => {
    const t = track.current;
    const s = t.children;
    return s.length > 1 ? s[1].offsetLeft - s[0].offsetLeft : t.clientWidth;
  }, []);

  const paint = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    const x = t.scrollLeft;
    const i = Math.min(total - 1, Math.round(x / stepW()));
    setNav({ index: max - x < 4 ? total : i + 1, progress: max > 0 ? Math.max(0.08, x / max) : 1, atStart: x < 4, atEnd: max - x < 4 });
  }, [stepW, total]);

  useEffect(() => {
    const t = track.current;
    if (!t) return;
    let tick = false;
    const onScroll = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(() => {
          tick = false;
          paint();
        });
      }
    };
    t.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', paint);
    paint();

    // mouse drag (touch devices already swipe natively)
    const d = drag.current;
    const down = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      d.down = { x: e.clientX, left: t.scrollLeft };
      d.moved = false;
    };
    const move = (e) => {
      if (!d.down) return;
      const dx = e.clientX - d.down.x;
      if (!d.moved && Math.abs(dx) > 6) {
        d.moved = true;
        setDragging(true);
      }
      if (d.moved) t.scrollLeft = d.down.left - dx;
    };
    const up = () => {
      if (!d.down) return;
      d.down = null;
      if (d.moved) {
        setDragging(false);
        const i = Math.round(t.scrollLeft / stepW());
        t.scrollTo({ left: i * stepW(), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    };
    // a drag must not count as a click on the slide's link
    const click = (e) => {
      if (d.moved) {
        e.preventDefault();
        e.stopPropagation();
        d.moved = false;
      }
    };
    const noDrag = (e) => e.preventDefault();
    t.addEventListener('pointerdown', down);
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    t.addEventListener('click', click, true);
    t.addEventListener('dragstart', noDrag);
    return () => {
      t.removeEventListener('scroll', onScroll);
      removeEventListener('resize', paint);
      t.removeEventListener('pointerdown', down);
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      t.removeEventListener('click', click, true);
      t.removeEventListener('dragstart', noDrag);
    };
  }, [paint, stepW]);

  const go = (dir) => track.current.scrollBy({ left: dir * stepW(), behavior: reduceMotion ? 'auto' : 'smooth' });

  return (
    <section id="services" className="services-section">
      <div className="wrap">
        <div className="svc-top">
          <div className="head">
            <Reveal as="p" className="eyebrow fade">
              {c.eyebrow}
            </Reveal>
            <SplitText as="h2" text={c.heading} />
          </div>
          {total > 0 && (
            <div className="svc-nav">
              <button type="button" className="svc-nav__btn svc-nav__prev" aria-label="Previous service" disabled={nav.atStart} onClick={() => go(-1)}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M14 8H2M7 3L2 8l5 5" />
                </svg>
              </button>
              <span className="svc-nav__count" aria-live="polite">
                <b>{pad2(nav.index)}</b> / {pad2(total)}
              </span>
              <span className="svc-nav__bar" aria-hidden="true">
                <i style={{ transform: `scaleX(${nav.progress})` }} />
              </span>
              <button type="button" className="svc-nav__btn svc-nav__next" aria-label="Next service" disabled={nav.atEnd} onClick={() => go(1)}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M2 8h12M9 3l5 5-5 5" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div
          ref={track}
          className={cx('svc-track', dragging && 'is-dragging')}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Services"
          data-cursor="drag"
        >
          {services.map((s, i) => (
            <ServiceSlide key={s.id ?? i} slide={s} index={i} total={total} />
          ))}
        </div>
      </div>
    </section>
  );
}
