import { useCallback, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import SocialLinks, { useSocialItems } from '../ui/SocialLinks';
import useScrollY from '../../hooks/useScrollY';
import cx from '../../utils/cx';

// SOCIAL RAIL (laptop and up): icons fixed on the left edge, framed by hairlines. As the dark footer slides underneath,
// each icon and hairline switches to its light version the moment the footer passes behind it.
export default function SocialRail() {
  const { pathname } = useLocation();
  const items = useSocialItems();
  const railRef = useRef(null);
  const icons = useRef({});
  const [dark, setDark] = useState({ icons: {}, top: false, bottom: false });

  const itemRef = useCallback((key) => (node) => { icons.current[key] = node; }, []);

  useScrollY(() => {
    const footer = document.querySelector('.footer');
    const rail = railRef.current;
    if (!footer || !rail) return;
    const ft = footer.getBoundingClientRect().top;
    const rr = rail.getBoundingClientRect();
    const next = { icons: {}, top: ft < rr.top + 24, bottom: ft < rr.bottom - 24 };
    Object.entries(icons.current).forEach(([k, li]) => {
      if (!li) return;
      const b = li.getBoundingClientRect();
      next.icons[k] = ft < b.top + b.height / 2;
    });
    setDark((d) => (JSON.stringify(d) === JSON.stringify(next) ? d : next));
  }, [pathname, items.length]);

  if (!items.length) return null;
  return (
    <aside ref={railRef} className={cx('social-rail', dark.top && 'top-dark', dark.bottom && 'bottom-dark')} aria-label="Social media">
      <SocialLinks itemRef={itemRef} itemClass={(k) => dark.icons[k] && 'on-dark'} />
    </aside>
  );
}
