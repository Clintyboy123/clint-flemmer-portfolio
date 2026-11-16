import { useEffect, useRef } from 'react';
import useSectionSpy from '../../hooks/useSectionSpy';
import { pad2, reduceMotion } from '../../utils/env';

// Sticky category bar (Works, Pricing): one pill per category with its count. It sits under the nav and slides up
// when the nav hides; the pill of the section on screen turns dark and scrolls itself into view in the bar.
export default function CategoryBar({ items }) {
  const active = useSectionSpy(true, [items.length]);
  const links = useRef({});

  useEffect(() => {
    const a = links.current[active];
    if (a) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [active]);

  if (items.length < 2) return null;
  return (
    <nav className="cats" aria-label="Categories">
      <div className="wrap">
        <ul>
          {items.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} ref={(n) => { links.current[c.id] = n; }} className={active === c.id ? 'active' : undefined}>
                {c.name}
                {c.count > 0 && (
                  <>
                    {' '}
                    <small>{pad2(c.count)}</small>
                  </>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
