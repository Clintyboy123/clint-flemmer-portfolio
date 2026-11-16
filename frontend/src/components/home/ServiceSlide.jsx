import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import useLoaded from '../../hooks/useLoaded';
import { pad2, reduceMotion } from '../../utils/env';
import cx from '../../utils/cx';

// One service: image (or a muted looping video while the slide is on screen), number, title, text, tags and a link.
export default function ServiceSlide({ slide, index, total }) {
  const ref = useRef(null);
  const video = useRef(null);
  const [imgRef, loaded, onLoad] = useLoaded();
  const [playing, setPlaying] = useState(false);
  const hasVideo = !!slide.video && !reduceMotion;

  useEffect(() => {
    if (!hasVideo) return;
    const v = video.current;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [hasVideo]);

  return (
    <div ref={ref} className={cx('svc-slide', slide.video && 'svc-slide--video')} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${total}`}>
      <figure className="svc-slide__media">
        <Link to={slide.link || '/works'}>
          <img ref={imgRef} onLoad={onLoad} className={loaded ? 'is-loaded' : undefined} loading="lazy" decoding="async" src={slide.image} alt={slide.title} draggable="false" />
          {hasVideo && (
            <video
              ref={video}
              className={cx('svc-slide__video', playing && 'is-on')}
              src={slide.video}
              poster={slide.image}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              onPlaying={() => setPlaying(true)}
            />
          )}
        </Link>
      </figure>
      <div className="svc-slide__body">
        <p className="svc-slide__n">{pad2(index + 1)}</p>
        <h3 className="svc-slide__title">{slide.title}</h3>
        <p className="svc-slide__text">{slide.text}</p>
        {slide.tags && <p className="svc-slide__tags">{slide.tags}</p>}
        {slide.link && (
          <p className="svc-slide__link">
            <Link to={slide.link}>{slide.linkLabel || 'See the work'}</Link>
          </p>
        )}
      </div>
    </div>
  );
}
