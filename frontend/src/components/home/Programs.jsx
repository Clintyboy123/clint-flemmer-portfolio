import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import Reveal from '../ui/Reveal';
import { reduceMotion } from '../../utils/env';

// Programs: name + percentage with a loading bar. When the list scrolls into view each bar fills to its value
// and the percentage counts up with it (1.6 s, ease-out, rows 140 ms apart).
const slug = (t) => t.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

export default function Programs({ title, programs = [] }) {
  const list = useRef(null);
  const rows = useRef([]);
  const seen = useInView(list, { once: true, margin: '0px 0px -15% 0px' });
  const animate = !reduceMotion;

  useEffect(() => {
    if (!seen || !animate) return;
    const frames = [];
    programs.forEach((p, i) => {
      const row = rows.current[i];
      if (!row) return;
      const to = Math.min(100, +p.percent || 0);
      const s0 = performance.now() + 250 + i * 140;
      const tick = (now) => {
        const t = Math.min(1, Math.max(0, (now - s0) / 1600));
        const v = to * easeOutQuart(t);
        row.fill.style.width = v + '%';
        row.pct.textContent = Math.round(v) + '%';
        if (t < 1) frames[i] = requestAnimationFrame(tick);
      };
      frames[i] = requestAnimationFrame(tick);
    });
    return () => frames.forEach(cancelAnimationFrame);
  }, [seen, animate, programs]);

  return (
    <div className="programs">
      <Reveal as="h4" className="fade">
        {title}
      </Reveal>
      <ul ref={list} className={animate ? 'programs__list is-armed' : 'programs__list'}>
        {programs.map((p, i) => {
          const to = Math.min(100, +p.percent || 0);
          const id = `prog-${i}-${slug(p.name)}`;
          return (
            <Reveal as="li" key={id} className="fade" delay={i * 60}>
              <span className="program" id={id}>
                {p.name}
              </span>
              <span className="pct" aria-hidden="true" ref={(n) => { rows.current[i] = { ...rows.current[i], pct: n }; }}>
                {animate ? '0%' : `${to}%`}
              </span>
              <span className="bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow={to} aria-labelledby={id} style={{ '--to': `${to}%` }}>
                <i ref={(n) => { rows.current[i] = { ...rows.current[i], fill: n }; }} />
              </span>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
