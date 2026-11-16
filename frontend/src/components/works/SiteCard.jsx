import { useCallback, useEffect, useRef, useState } from 'react';
import useLoaded from '../../hooks/useLoaded';
import useMidScreenColour from '../../hooks/useMidScreenColour';
import Reveal from '../ui/Reveal';
import { canHover } from '../../utils/env';
import cx from '../../utils/cx';

// A live website: browser-framed preview with the site's address in the bar. On hover the full-page screenshot
// scrolls through the frame at a steady reading speed (200 px/s); on touch screens it scrolls by itself while on
// screen. Preview and "Visit site" open the site in a new tab.
const hostOf = (url) => {
  try {
    const u = new URL(url);
    return (u.host + u.pathname).replace(/\/$/, '').replace(/\.html$/, '');
  } catch {
    return url;
  }
};

export default function SiteCard({ work }) {
  const link = useRef(null);
  const imgEl = useRef(null);
  const fig = useRef(null);
  const [loadRef, loaded, onLoad] = useLoaded();
  const colour = useMidScreenColour(imgEl);
  const [auto, setAuto] = useState(false);
  const [scroll, setScroll] = useState({ dist: 0, dur: 4 });

  const fit = useCallback(() => {
    const im = imgEl.current;
    const a = link.current;
    if (!im || !a || !im.naturalWidth) return;
    const dist = Math.max(0, im.offsetHeight - a.clientHeight);
    setScroll({ dist, dur: Math.max(4, dist / 200) });
  }, []);

  useEffect(() => {
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, [fit]);

  useEffect(() => {
    if (loaded) fit();
  }, [loaded, fit]);

  useEffect(() => {
    if (canHover) return;
    const io = new IntersectionObserver(([e]) => setAuto(e.isIntersecting), { threshold: 0.6 });
    io.observe(fig.current);
    return () => io.disconnect();
  }, []);

  return (
    <Reveal className="site">
      <figure
        ref={fig}
        className={cx('site__media', auto && 'is-auto')}
        style={{ '--dist': `-${scroll.dist}px`, '--dur': `${scroll.dur.toFixed(1)}s` }}
      >
        <span className="site__bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="site__url">{hostOf(work.url)}</span>
        </span>
        <a ref={link} href={work.url} target="_blank" rel="noopener" aria-label={`Visit ${work.title || 'the site'} (opens in a new tab)`} data-cursor="visit">
          <img
            ref={(n) => {
              imgEl.current = n;
              loadRef(n);
            }}
            onLoad={onLoad}
            className={cx(loaded && 'is-loaded', colour && 'is-colour') || undefined}
            loading="lazy"
            decoding="async"
            src={work.image}
            alt={`${work.title} website preview`}
          />
        </a>
      </figure>
      <div className="site__info">
        <h3>{work.title}</h3>
        {work.description && <p className="piece__desc">{work.description}</p>}
        {work.meta && <p className="piece__meta">{work.meta}</p>}
        <p className="site__link">
          <a href={work.url} target="_blank" rel="noopener">
            Visit site
          </a>
        </p>
      </div>
    </Reveal>
  );
}
