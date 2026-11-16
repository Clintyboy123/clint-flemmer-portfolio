// The API's tiny inline format: **bold**, ~~struck through~~ and a newline for a line break. Never HTML.
// Turns a string into tokens: { t: 'text' | 'b' | 's' | 'br', v }.
export function parseInline(str = '') {
  const tokens = [];
  const re = /\*\*([\s\S]+?)\*\*|~~([\s\S]+?)~~|\r?\n/g;
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) tokens.push({ t: 'text', v: str.slice(last, m.index) });
    if (m[1] != null) tokens.push({ t: 'b', v: m[1] });
    else if (m[2] != null) tokens.push({ t: 's', v: m[2] });
    else tokens.push({ t: 'br' });
    last = re.lastIndex;
  }
  if (last < str.length) tokens.push({ t: 'text', v: str.slice(last) });
  return tokens;
}

// Plain text of a formatted string (for titles, labels, aria text).
export const plainText = (str = '') => parseInline(str).map((x) => (x.t === 'br' ? ' ' : x.v)).join('');
