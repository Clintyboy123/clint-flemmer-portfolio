import { Link, useLocation } from 'react-router';
import { useContent, useSite } from '../../context/SiteContext';
import Reveal from '../ui/Reveal';
import RichText from '../ui/RichText';
import SplitText from '../ui/SplitText';
import SocialLinks, { useSocialItems } from '../ui/SocialLinks';
import { reduceMotion } from '../../utils/env';

// Footer: big logo, email, location, social icons, copyright (always showing the current year).
// A column with nothing to show (no email, no social links set) is left out rather than shown empty.
export default function Footer() {
  const f = useContent('footer');
  const { settings } = useSite();
  const { pathname } = useLocation();
  const social = useSocialItems();
  const copyright = (f.copyright || '').replace(/\b(19|20)\d{2}\b/, new Date().getFullYear());

  // "Back to top" on the home page itself just scrolls up (the old link reloaded the page at the top)
  const toTop = (e) => {
    if (pathname !== '/') return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer id="contact" className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <SplitText className="logo--footer" text="Clint." linkTo="/" optical accent />
          {settings.email && (
            <Reveal className="fade">
              <h5>{f.contactTitle}</h5>
              <p>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </p>
            </Reveal>
          )}
          <Reveal className="fade" delay={100}>
            <h5>{f.locationTitle}</h5>
            <p className="breaks-wide">
              <RichText text={f.location} />
            </p>
          </Reveal>
          {social.length > 0 && (
            <Reveal className="fade" delay={200}>
              <h5>{f.followTitle}</h5>
              <SocialLinks className="social--dark" />
            </Reveal>
          )}
        </div>
        <div className="footer__bottom">
          <p className="copyright">{copyright}</p>
          <p className="to-top">
            <Link to="/" onClick={toTop}>
              Back to top ↑
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
