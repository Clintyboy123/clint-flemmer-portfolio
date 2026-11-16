import { useEffect } from 'react';
import { finePointer, reduceMotion } from '../utils/env';

// Magnetic buttons: the button leans towards the pointer while it hovers (mouse/trackpad only, not with reduced motion).
export default function useMagnetic(ref) {
  useEffect(() => {
    const m = ref.current;
    if (!m || reduceMotion || !finePointer) return;
    const move = (e) => {
      const r = m.getBoundingClientRect();
      m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    };
    const leave = () => (m.style.transform = '');
    m.addEventListener('pointermove', move);
    m.addEventListener('pointerleave', leave);
    return () => {
      m.removeEventListener('pointermove', move);
      m.removeEventListener('pointerleave', leave);
    };
  }, [ref]);
}
