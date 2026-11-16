// After a failed save, move focus to the first field the API (or the browser check) flagged.
export function focusFirstInvalid(container) {
  requestAnimationFrame(() => {
    container?.querySelector('[aria-invalid="true"]')?.focus();
  });
}

export const isHttpUrl = (value) => /^https?:\/\/\S+$/i.test(String(value || '').trim());
export const isSlug = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || ''));
