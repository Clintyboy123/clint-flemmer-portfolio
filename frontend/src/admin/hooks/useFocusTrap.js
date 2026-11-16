import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Keeps keyboard focus inside `ref` while active, closes on Escape,
// and gives focus back to whatever opened it when it closes.
export default function useFocusTrap(ref, active, onEscape) {
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    if (!active) return undefined;
    const opener = document.activeElement;
    const node = ref.current;

    // A dialog rendered outside the app (a portal) locks the app behind it, so screen readers,
    // Tab and clicks can't reach the page underneath. Done after remembering the opener,
    // because locking the page takes focus off it.
    const app = document.getElementById('root');
    const lockPage = Boolean(app && node && !app.contains(node));
    if (lockPage) app.inert = true;

    const focusables = () => [...(node?.querySelectorAll(FOCUSABLE) || [])].filter((el) => el.offsetParent !== null || el === document.activeElement);

    // Focus the first field (or the container) once the element is in the page.
    const frame = requestAnimationFrame(() => {
      const autofocus = node?.querySelector('[data-autofocus]');
      (autofocus || focusables()[0] || node)?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        escapeRef.current?.();
        return;
      }
      if (event.key !== 'Tab' || !node) return;
      const items = focusables();
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      if (lockPage) app.inert = false; // unlock first: focus can't return to a locked element
      if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
    };
  }, [active, ref]);
}
