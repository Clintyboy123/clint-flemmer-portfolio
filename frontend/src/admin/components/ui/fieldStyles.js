// Shared look for every text control: 48px tall, hairline border, clear focus ring.
export const control =
  'w-full rounded-xl border bg-paper px-4 text-left text-body text-ink placeholder:text-muted/70 transition-colors duration-200 ease-out-soft focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent disabled:bg-soft disabled:text-muted';

export const controlBorder = (error) => (error ? 'border-danger' : 'border-line hover:border-muted focus:border-ink');
