// Read once at start-up, exactly as the original script did (it never re-checked on the fly).
const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export const reduceMotion = mq('(prefers-reduced-motion: reduce)');
export const finePointer = mq('(hover: hover) and (pointer: fine)');
export const canHover = mq('(hover: hover)');

// "7" -> "07"
export const pad2 = (n) => String(n).padStart(2, '0');
