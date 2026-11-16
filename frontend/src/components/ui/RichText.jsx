import { Fragment } from 'react';
import { parseInline } from '../../utils/inline';

// Renders the API's inline format safely as React elements: **bold**, ~~strike~~, newline = <br>.
// A space follows each <br> so the words still part when "breaks-wide" hides the break on small screens.
export default function RichText({ text }) {
  return parseInline(text).map((tk, k) => {
    if (tk.t === 'b') return <strong key={k}>{tk.v}</strong>;
    if (tk.t === 's') return <s key={k}>{tk.v}</s>;
    if (tk.t === 'br') return <Fragment key={k}><br />{' '}</Fragment>;
    return <Fragment key={k}>{tk.v}</Fragment>;
  });
}
