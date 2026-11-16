import { useIntro } from '../../context/IntroContext';
import cx from '../../utils/cx';

// The preloader curtain (styles: site.css PRELOADER / PAGE TRANSITION). Re-mounted for each page change
// (key = cycle) so it covers the page instantly, then lifts with its clip-path transition.
export default function Loader() {
  const { cycle, quick, ready } = useIntro();
  return (
    <div key={cycle} className={cx('loader', quick && 'is-quick', ready && 'is-done')} aria-hidden="true">
      <div className="loader__bar" />
    </div>
  );
}
