import { useRef, useState } from 'react';
import useScrollY from '../../hooks/useScrollY';
import { reduceMotion } from '../../utils/env';
import cx from '../../utils/cx';

// Scroll-to-top: appears after the first screen; its ring fills with the scroll progress.
export default function ToTopButton() {
  const [on, setOn] = useState(false);
  const ring = useRef(null);
  useScrollY((y) => {
    const h = document.documentElement.scrollHeight - innerHeight;
    setOn(y > innerHeight * 0.9);
    if (ring.current) ring.current.style.strokeDashoffset = 144.5 * (1 - (h > 0 ? y / h : 0));
  });
  const up = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    document.querySelector('a.logo')?.focus({ preventScroll: true });
  };
  return (
    <button className={cx('to-top-btn', on && 'is-on')} aria-label="Scroll to top" tabIndex={on ? 0 : -1} onClick={up}>
      <svg className="to-top-btn__ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle ref={ring} cx="24" cy="24" r="23" />
      </svg>
      <svg className="to-top-btn__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M8 14V2M3 7l5-5 5 5" />
      </svg>
    </button>
  );
}
