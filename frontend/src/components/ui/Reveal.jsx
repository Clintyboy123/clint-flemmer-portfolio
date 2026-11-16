import { useCallback } from 'react';
import useReveal from '../../hooks/useReveal';
import cx from '../../utils/cx';

// Any element that animates in (class "fade", "split", "work", "piece" ...): adds "in" when it should play.
//   <Reveal as="p" className="fade" delay={100}>…</Reveal>      delay = the original's d-100 class (--d)
//   <Reveal className="fade" load delay={1100}>…</Reveal>        plays as the preloader lifts
export default function Reveal({ as: Tag = 'div', className, load = false, delay, style, elRef, children, ...rest }) {
  const [ref, on] = useReveal({ load });
  // keep our own ref for the in-view check and hand the node to the caller too
  const setRef = useCallback(
    (node) => {
      ref.current = node;
      if (typeof elRef === 'function') elRef(node);
      else if (elRef) elRef.current = node;
    },
    [ref, elRef]
  );
  const s = delay ? { ...style, '--d': `${delay}ms` } : style;
  return (
    <Tag ref={setRef} className={cx(className, on && 'in')} style={s} {...rest}>
      {children}
    </Tag>
  );
}
