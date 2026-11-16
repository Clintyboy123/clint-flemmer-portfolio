import { useRef } from 'react';
import { Link } from 'react-router';
import Reveal from './Reveal';
import useOpticalEdge from '../../hooks/useOpticalEdge';
import { parseInline } from '../../utils/inline';
import cx from '../../utils/cx';

// TEXT REVEAL: words fade up out of a soft blur, one after another (site.css ".split").
// Each word is <span class="w"><span style="--i:n">word</span></span>; bold/struck runs move as one word.
// accent: a final . ! or ? turns brand red (the original did this for every big heading).
// Display type (h1, h2, footer logo) also gets the optical left edge.
function words(text, accent) {
  const tokens = parseInline(text);
  if (accent) {
    const last = tokens.findLastIndex((t) => t.t !== 'br');
    const m = last >= 0 && tokens[last].t === 'text' && tokens[last].v.match(/^([\s\S]*?)([.!?])(\s*)$/);
    if (m) tokens.splice(last, 1, { t: 'text', v: m[1] }, { t: 'dot', v: m[2] });
  }
  let i = 0;
  const out = [];
  const unit = (content, key) => (
    <span className="w" key={key}>
      <span style={{ '--i': i++ }}>{content}</span>
    </span>
  );
  tokens.forEach((tk, k) => {
    if (tk.t === 'br') out.push(<br key={`br${k}`} />, ' ');
    else if (tk.t === 'b') out.push(unit(<strong>{tk.v}</strong>, k));
    else if (tk.t === 's') out.push(unit(<s>{tk.v}</s>, k));
    else if (tk.t === 'dot') out.push(unit(<span className="dot">{tk.v}</span>, k));
    else
      tk.v.split(/(\s+)/).forEach((part, j) => {
        if (!part) return;
        out.push(/^\s+$/.test(part) ? ' ' : unit(part, `${k}-${j}`));
      });
  });
  return out;
}

export default function SplitText({ as = 'p', text = '', accent, linkTo, className, optical, ...rest }) {
  const ref = useRef(null);
  const display = optical ?? (as === 'h1' || as === 'h2');
  useOpticalEdge(display ? ref : NO_REF, text);
  const content = words(text, accent ?? display);
  return (
    <Reveal as={as} elRef={ref} className={cx(className, 'split')} {...rest}>
      {linkTo ? <Link to={linkTo}>{content}</Link> : content}
    </Reveal>
  );
}
const NO_REF = { current: null };
