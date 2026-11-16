import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import SocialLinks from '../ui/SocialLinks';
import { useSite } from '../../context/SiteContext';
import useScrollY from '../../hooks/useScrollY';
import useSectionSpy from '../../hooks/useSectionSpy';
import cx from '../../utils/cx';

// Main navigation. Turns solid once you scroll (40px), hides while scrolling down past 400px and returns on the way up.
// Phones get the burger and the full-screen menu (site.css; opened with body.menu-open).
// The underline marks the page you're on; on the home page, About / Services follow the section on screen.
const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about', section: 'about' },
  { label: 'Services', to: '/#services', section: 'services' },
  { label: 'Works', to: '/works' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/contact' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [bar, setBar] = useState({ scrolled: false, hidden: false, lastY: 0 });
  const { site } = useSite();
  const onHome = pathname === '/';
  // re-attach once the page content exists (on a first visit it arrives after the nav mounts)
  const active = useSectionSpy(onHome && !!site, [pathname]);

  useScrollY((y) =>
    setBar((b) => {
      const next = { scrolled: y > 40, hidden: y > b.lastY && y > 400 && !document.body.classList.contains('menu-open'), lastY: y };
      return next.scrolled === b.scrolled && next.hidden === b.hidden ? { ...b, lastY: y } : next;
    })
  );

  useEffect(() => {
    document.body.classList.toggle('nav-hidden', bar.hidden);
  }, [bar.hidden]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open]);

  // close the phone menu whenever the page or section changes
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (l) => (l.section ? onHome && active === l.section : pathname === l.to);

  return (
    <header className={cx('nav', bar.scrolled && 'is-scrolled', bar.hidden && 'is-hidden')} id="nav">
      <div className="wrap">
        <Link to="/" className="logo" aria-label="Clint Flemmer, home">
          <img className="mark--head" src="/img/logo-head.png" alt="" width="34" height="46" />
          <span className="logo__word">
            Clint<span className="dot">.</span>
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="menu" id="menu">
            {LINKS.map((l) => {
              const current = !l.section && pathname === l.to;
              return (
                <li key={l.label}>
                  <Link to={l.to} className={isActive(l) ? 'active' : undefined} aria-current={current ? 'page' : undefined} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li className="menu__social">
              <SocialLinks />
            </li>
          </ul>
        </nav>
        <button
          className="burger"
          id="burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
