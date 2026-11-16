// The admin's motion language, defined once. Keep `ease` in step with --ease-out-soft in admin.css.
export const ease = [0.16, 1, 0.3, 1];

export const duration = {
  fast: 0.18, // exits, small state changes
  base: 0.32, // entrances, modals, menus
  slow: 0.5, // page arrival
};

// Page change: a short fade and lift.
export const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.slow, ease } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease } },
};

// Dimmed backdrop behind modals and the mobile menu.
export const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.base, ease } },
  exit: { opacity: 0, transition: { duration: duration.fast, ease } },
};

// Centred dialog.
export const dialog = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: duration.base, ease } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: duration.fast, ease } },
};

// Mobile menu sliding in from the left.
export const drawer = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: { duration: duration.base, ease } },
  exit: { x: '-100%', transition: { duration: duration.fast, ease } },
};

// Toasts rising from the bottom.
export const toast = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
  exit: { opacity: 0, y: 8, transition: { duration: duration.fast, ease } },
};

// Rows that reorder: pass to `transition` alongside the `layout` prop.
export const layoutTransition = { duration: duration.base, ease };
