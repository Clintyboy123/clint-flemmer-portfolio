import { useEffect, useRef } from 'react';
import { finePointer, reduceMotion } from '../../utils/env';

// A small red label that follows the pointer over things marked data-cursor: "View" on projects, "Drag" on the
// services carousel (sites are marked "visit" but, as in the original, only View and Drag show the label).
const LABELS = { drag: 'Drag', visit: 'Visit', view: 'View' };

export default function CursorTag() {
  const ref = useRef(null);
  useEffect(() => {
    if (reduceMotion || !finePointer) return;
    const tag = ref.current;
    const move = (e) => {
      tag.style.transform = `translate3d(${e.clientX + 22}px, ${e.clientY + 22}px, 0)`;
      const c = e.target.closest?.('[data-cursor]');
      const kind = c && c.dataset.cursor;
      if (kind && tag.dataset.kind !== kind) {
        tag.textContent = LABELS[kind] || 'View';
        tag.dataset.kind = kind;
      }
      const lightboxOpen = !!document.querySelector('.lb');
      tag.classList.toggle('is-on', (kind === 'view' && !lightboxOpen) || kind === 'drag');
    };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, []);
  return (
    <div ref={ref} className="cursor-tag" aria-hidden="true">
      View
    </div>
  );
}
