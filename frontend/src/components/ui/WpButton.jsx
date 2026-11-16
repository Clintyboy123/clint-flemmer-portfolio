import { useRef } from 'react';
import { Link } from 'react-router';
import useMagnetic from '../../hooks/useMagnetic';
import cx from '../../utils/cx';

// The site's pill button, in the original's markup (site.css styles ".btn--solid > .wp-block-button__link").
//   <WpButton to="/works" arrow>See my work</WpButton>         internal page
//   <WpButton href="https://…" external>Check out my page</WpButton>
export default function WpButton({ to, href, external, variant = 'solid', arrow = false, children }) {
  const ref = useRef(null);
  useMagnetic(ref);
  const cls = 'wp-block-button__link wp-element-button';
  return (
    <div ref={ref} className={cx('wp-block-button btn', `btn--${variant}`, arrow && 'btn--arrow', 'magnetic')}>
      {to ? (
        <Link className={cls} to={to}>
          {children}
        </Link>
      ) : (
        <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
          {children}
        </a>
      )}
    </div>
  );
}
