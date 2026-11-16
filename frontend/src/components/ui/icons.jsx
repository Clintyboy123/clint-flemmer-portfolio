// The original site's own inline icons (kept as drawn, not swapped for an icon set).
export const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M13.5 21v-7.5h2.6l.4-3H13.5V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z" />
  </svg>
);
export const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
  </svg>
);
export const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M16.6 3c.3 2.3 1.7 3.8 3.9 4v3.1c-1.4.1-2.8-.3-3.9-1.1v6.1c0 3.1-2.5 5.6-5.6 5.6S5.4 18.2 5.4 15.1s2.5-5.6 5.6-5.6c.3 0 .6 0 .9.1v3.2a2.4 2.4 0 1 0 1.6 2.3V3h3.1z" />
  </svg>
);
const WA_BUBBLE = 'M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z';
const WA_PHONE = 'M9.1 7.6c.3 0 .5.1.6.4l.8 1.9c.1.3 0 .5-.1.7l-.6.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.6c.2-.2.5-.2.7-.1l1.9.8c.3.1.4.4.4.6 0 1.3-1 2.2-2.2 2.2-3.6 0-6.6-3-6.6-6.6 0-1.4 1-2.4 2.2-2.4z';
export const WhatsAppIcon = ({ className, strokeWidth = 1.5, focusable = true }) => (
  <svg
    className={className}
    width={className ? undefined : 24}
    height={className ? undefined : 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    aria-hidden="true"
    {...(focusable ? { focusable: 'false' } : {})}
  >
    <path d={WA_BUBBLE} strokeLinejoin="round" />
    <path d={WA_PHONE} fill="currentColor" stroke="none" />
  </svg>
);
export const ArrowRight = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 8h13M9 3l5 5-5 5" />
  </svg>
);
