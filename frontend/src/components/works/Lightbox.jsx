import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { pad2, reduceMotion } from '../../utils/env';
import cx from '../../utils/cx';

// Project viewer: browses the projects of one category. Images show full; videos play with sound and controls.
// Keyboard: ← → to browse, Esc to close, Tab stays inside while it's open; focus returns to the project afterwards.
export default function Lightbox({ items, index, onIndex, onClose, opener }) {
  const root = useRef(null);
  const media = useRef(null);
  const closeBtn = useRef(null);
  const [open, setOpen] = useState(false);
  const closing = useRef(false);
  const work = items[index];

  const show = (i) => onIndex((i + items.length) % items.length);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    setOpen(false);
    document.body.style.overflow = '';
    opener?.focus();
    setTimeout(onClose, reduceMotion ? 0 : 500);
  };

  // open: fade in on the next frame, lock the page scroll, focus the close button
  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true));
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, []);

  // each project arrives out of a soft blur
  useLayoutEffect(() => {
    if (reduceMotion || !media.current) return;
    media.current.animate(
      [{ opacity: 0, transform: 'scale(.97)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
      { duration: 600, easing: 'cubic-bezier(.16,1,.3,1)' }
    );
  }, [index]);

  useEffect(() => {
    const key = (e) => {
      if (closing.current) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'Tab') {
        const f = [...root.current.querySelectorAll('button, video[controls], a[href]')];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  });

  if (!work) return null;
  return (
    <div
      ref={root}
      className={cx('lb', open && 'is-open')}
      role="dialog"
      aria-modal="true"
      aria-label="Project viewer"
      onClick={(e) => e.target === root.current && close()}
    >
      <div className="lb__top">
        <span className="lb__count">
          {pad2(index + 1)} / {pad2(items.length)}
        </span>
        <button ref={closeBtn} className="lb__close" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 2l12 12M14 2L2 14" />
          </svg>
        </button>
      </div>
      <div className="lb__stage">
        <button className="lb__nav lb__prev" aria-label="Previous" onClick={() => show(index - 1)}>
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 9H2M7 4L2 9l5 5" />
          </svg>
        </button>
        <div ref={media} className="lb__media">
          <div className="lb__frame" key={work.id ?? index}>
            {work.video ? (
              <video src={work.video} poster={work.image} playsInline preload="auto" controls autoPlay />
            ) : (
              <img src={work.image} alt={work.title} />
            )}
          </div>
        </div>
        <button className="lb__nav lb__next" aria-label="Next" onClick={() => show(index + 1)}>
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 9h15M11 4l5 5-5 5" />
          </svg>
        </button>
      </div>
      <div className="lb__cap">
        <p className="lb__title">{work.title}</p>
        <p className="lb__desc">{work.description}</p>
        <span className="lb__meta">{work.meta}</span>
      </div>
    </div>
  );
}
