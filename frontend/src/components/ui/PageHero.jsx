import HeroGlows from './HeroGlows';
import Reveal from './Reveal';
import SplitText from './SplitText';
import cx from '../../utils/cx';

// Page header for Works, Pricing, Contact and 404: eyebrow, big title and intro, with the red light behind.
// "aside" (the Works icon flick) sits inside the grid, on the right; children follow the intro (e.g. buttons).
export default function PageHero({ eyebrow, title, intro, aside, className, children }) {
  return (
    <header className={cx('page-hero has-glow', className)}>
      <HeroGlows />
      <div className="wrap">
        {aside}
        <Reveal as="p" className="eyebrow fade" load>
          {eyebrow}
        </Reveal>
        <SplitText as="h1" load delay={150} text={title} />
        {intro && <SplitText as="p" className="breaks-wide" load delay={450} text={intro} />}
        {children}
      </div>
    </header>
  );
}
