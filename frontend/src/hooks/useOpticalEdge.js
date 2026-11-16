import { useEffect } from 'react';

// OPTICAL LEFT EDGE: display type is pulled back by its first glyph's left side bearing.
// Measured on a canvas once the web font is ready and written to --ob (site.css applies it as a negative margin).
let ctx = null;

export function measureBearing(el) {
  if (!el) return;
  const cs = getComputedStyle(el);
  const ch = el.textContent.trim()[0];
  if (!ch) return;
  ctx = ctx || document.createElement('canvas').getContext('2d');
  ctx.font = `${cs.fontWeight} 200px ${cs.fontFamily}`;
  const lsb = -ctx.measureText(ch).actualBoundingBoxLeft;
  el.style.setProperty('--ob', (Math.max(0, lsb) / 200).toFixed(4));
}

export default function useOpticalEdge(ref, text) {
  useEffect(() => {
    let live = true;
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => live && measureBearing(ref.current));
    return () => {
      live = false;
    };
  }, [ref, text]);
}
