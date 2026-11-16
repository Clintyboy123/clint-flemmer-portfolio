import { useEffect, useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import cx from '../../utils/cx';

// Music control (bottom left): note button (slashed when off or at zero volume) + a volume slider that slides
// out on hover / keyboard focus (hidden on touch screens, which use their own volume buttons).
export default function MusicControl() {
  const { available, playing, level, toggle, setLevel } = useMusic();
  const [ready, setReady] = useState(false);

  // fade in a couple of frames after it appears, so the entrance transition plays
  useEffect(() => {
    if (!available) return;
    let r2;
    const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setReady(true))));
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [available]);

  if (!available) return null;
  const pct = Math.round(level * 100);
  return (
    <div className={cx('music', ready && 'is-ready')} style={{ '--vol': level }}>
      <button
        type="button"
        className={cx('music-btn', playing && 'is-playing', (!playing || level === 0) && 'is-muted')}
        aria-pressed={playing}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Music off' : 'Music on'}
        onClick={toggle}
      >
        <svg className="music-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V5l11-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
          <path className="music-btn__gap" d="M3.5 3.5l17 17" />
          <path className="music-btn__slash" d="M3.5 3.5l17 17" />
        </svg>
      </button>
      <div className="music__vol">
        <input type="range" min="0" max="100" step="1" aria-label="Music volume" aria-valuetext={`${pct}%`} value={pct} onChange={(e) => setLevel(e.target.value / 100)} />
      </div>
    </div>
  );
}
