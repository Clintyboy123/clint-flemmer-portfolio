import { useRef } from 'react';
import { Link } from 'react-router';
import { useContent } from '../../context/SiteContext';
import HeroGlows from '../ui/HeroGlows';
import PenLogo from './PenLogo';
import Reveal from '../ui/Reveal';
import SplitText from '../ui/SplitText';
import WpButton from '../ui/WpButton';
import useScrollY from '../../hooks/useScrollY';
import { reduceMotion } from '../../utils/env';

// Home hero: headline words reveal one after another as the preloader lifts, the portrait draws itself,
// and the soft background (with the drifting red light) moves slower than the page (parallax).
export default function Hero() {
  const c = useContent('home.hero');
  const bg = useRef(null);
  useScrollY((y) => {
    if (!bg.current || reduceMotion || y >= innerHeight * 1.2) return;
    bg.current.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(${1 + y / 6000})`;
  });

  return (
    <section id="home" className="hero">
      <div ref={bg} className="hero__bg">
        <HeroGlows />
      </div>
      <div className="wrap hero__inner">
        <PenLogo />
        <SplitText as="p" className="hero__hi" load text={c.hi} />
        <SplitText as="h1" load delay={250} text={c.title} />
        <SplitText as="p" className="hero__sub breaks-wide" load delay={700} text={c.sub} />
        <Reveal className="wp-block-buttons hero__cta fade" load delay={1100}>
          <WpButton to="/works" arrow>
            {c.primaryLabel}
          </WpButton>
          <WpButton to="/contact" variant="ghost">
            {c.secondaryLabel}
          </WpButton>
        </Reveal>
      </div>
      <Reveal className="hero__meta fade" load delay={1300}>
        <div className="wrap">
          <p>{c.meta}</p>
          <p className="scroll-cue">
            <Link to="/#about">Scroll</Link>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
