import { useRef } from 'react';
import useLoaded from '../../hooks/useLoaded';
import useMidScreenColour from '../../hooks/useMidScreenColour';
import Reveal from '../ui/Reveal';
import cx from '../../utils/cx';

// One project in the masonry gallery: black & white at rest, colour on hover/focus; the image is revealed by a
// clip as it scrolls in. Opens the lightbox on click, Enter or Space. Videos show a play badge.
export default function Piece({ work, onOpen }) {
  const imgEl = useRef(null);
  const [loadRef, loaded, onLoad] = useLoaded();
  const colour = useMidScreenColour(imgEl);
  const setImg = (n) => {
    imgEl.current = n;
    loadRef(n);
  };
  const open = (e) => {
    const a = e.target.closest('a');
    if (!a || a.closest('.piece__media')) {
      e.preventDefault();
      onOpen(e.currentTarget);
    }
  };
  const img = (
    <img
      ref={setImg}
      onLoad={onLoad}
      className={cx(loaded && 'is-loaded', colour && 'is-colour') || undefined}
      loading="lazy"
      decoding="async"
      src={work.image}
      alt={work.title}
      width={work.imageWidth || undefined}
      height={work.imageHeight || undefined}
    />
  );
  return (
    <Reveal
      className={cx('piece', work.video && 'is-video')}
      data-cursor="view"
      tabIndex={0}
      role="button"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(e.currentTarget);
        }
      }}
    >
      <figure className="piece__media">{work.video ? <a href={work.video}>{img}</a> : img}</figure>
      <h3>{work.title}</h3>
      {work.description && <p className="piece__desc">{work.description}</p>}
      {work.meta && <p className="piece__meta">{work.meta}</p>}
    </Reveal>
  );
}
