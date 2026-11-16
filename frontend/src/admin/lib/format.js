const THIN = ' ';
const NBSP = ' ';

// 2500 -> "R 2 500" (thin spaces between thousands, like the public site).
export function formatRand(amount) {
  if (amount === null || amount === undefined || amount === '') return '';
  const digits = String(Math.round(Number(amount))).replace(/\B(?=(\d{3})+(?!\d))/g, THIN);
  return `R${NBSP}${digits}`;
}

export function formatPrice(item) {
  if (item.amount === null || item.amount === undefined) return 'Quoted per project';
  return `${item.isFrom ? 'From ' : ''}${formatRand(item.amount)}`;
}

// "Graphic Design!" -> "graphic-design"
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function formatDate(value, withTime = false) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Pulls http(s) links out of free text; anything else stays as plain text.
export function splitLinks(text) {
  return String(text || '')
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      try {
        const url = new URL(part);
        if (url.protocol === 'http:' || url.protocol === 'https:') return { href: url.href, label: part };
      } catch {
        /* not a URL */
      }
      return { text: part };
    });
}

export function plural(count, one, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}
