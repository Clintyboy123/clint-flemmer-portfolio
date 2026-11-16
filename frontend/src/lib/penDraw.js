/* Hero logo — drawn live with the pen tool, the way a person would in Illustrator.
   For every shape: the pen moves to a point, clicks to drop an anchor, and on curves drags
   out the handles so the segment bends into shape as you watch. The stroke and the fill
   build up together; clicking back on the first anchor closes the path, then it deselects
   and the pen moves on to the next shape. It starts at a human pace and speeds up like a
   time-lapse so the whole portrait lands in a few seconds.
   Node data: lib/logoPaths.js — [x, y, inX, inY, outX, outY] per anchor (traced from img/logo.png).

   Ported from the original js/pen-draw.js as an imperative module, run by components/home/PenLogo.jsx:
     const pen = penDraw(hostElement, LOGO_PATHS);  pen.start();  …  pen.destroy();
   The drawing code itself is unchanged; only the start-up and a clean-up (timers, frames, listeners) were added. */
export default function penDraw(host, data) {
  let destroyed = false;
  let drawRaf = 0, followRaf = 0, penTimer = 0;
  const listeners = [];   // [target, type, fn, options] removed by destroy()
  const listen = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); listeners.push([target, type, fn, opts]); };
  const destroy = () => {
    destroyed = true;
    cancelAnimationFrame(drawRaf); cancelAnimationFrame(followRaf); clearTimeout(penTimer);
    listeners.forEach(([t, ty, fn, o]) => t.removeEventListener(ty, fn, o));
    host.replaceChildren();
  };

  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.append(n);
    return n;
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const BRAND = css.getPropertyValue('--brand').trim() || '#354a52';
  const ACCENT = css.getPropertyValue('--accent').trim() || '#f21e4e';

  /* ---- Geometry helpers ---- */
  const P = ([x, y]) => `${+x.toFixed(1)} ${+y.toFixed(1)}`;
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const pt = n => [n[0], n[1]];
  const hIn = n => (n[2] == null ? null : [n[2], n[3]]);
  const hOut = n => (n[4] == null ? null : [n[4], n[5]]);
  // segment a → b, with each node's handle grown by its own amount (0 = still a point, 1 = fully dragged)
  const seg = (a, b, ga = 1, gb = 1) => {
    const o = hOut(a), i = hIn(b);
    if (!o && !i) return `L${P(pt(b))}`;
    const c1 = o ? lerp(pt(a), o, ga) : pt(a);
    const c2 = i ? lerp(pt(b), i, gb) : pt(b);
    return `C${P(c1)} ${P(c2)} ${P(pt(b))}`;
  };
  const fullD = nodes => `M${P(pt(nodes[0]))}` + nodes.map((n, i) => seg(n, nodes[(i + 1) % nodes.length])).join('') + 'Z';

  /* ---- SVG (replaces the PNG fallback) ---- */
  const vb = data.vb || [0, 0, data.w, data.h];   // artboard cropped to the ink
  const svg = el('svg', { viewBox: vb.join(' '), class: 'pen-logo', 'aria-hidden': 'true' });
  const fill = el('path', { fill: BRAND, 'fill-rule': 'evenodd', class: 'pen-logo__fill' }, svg);
  const finalD = data.paths.map(p => fullD(p.n)).join('');
  host.replaceChildren(svg);
  if (reduce) { fill.setAttribute('d', finalD); return { start() {}, destroy }; }

  const chrome = el('g', { class: 'pen-logo__chrome' }, svg);
  const rubber = el('path', { fill: 'none', stroke: ACCENT, 'stroke-width': 1, 'stroke-opacity': .55, 'vector-effect': 'non-scaling-stroke' }, chrome);
  const stroke = el('path', { fill: 'none', stroke: ACCENT, 'stroke-width': 1.25, 'vector-effect': 'non-scaling-stroke' }, chrome);
  const anchorsG = el('g', { fill: '#fff', stroke: ACCENT, 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }, chrome);
  const handleG = el('g', { stroke: ACCENT, 'stroke-width': 1, fill: ACCENT }, chrome);
  const hLines = [0, 1].map(() => el('line', { 'vector-effect': 'non-scaling-stroke' }, handleG));
  const hDots = [0, 1].map(() => el('circle', { r: 0 }, handleG));
  const pen = el('g', { class: 'pen-logo__pen' }, svg);
  // Pen nib (same drawing as the site cursor, tip at 0,0) + Illustrator's state marks: * new path, o close path
  pen.innerHTML = '<g class="pen-logo__nib"><g transform="translate(-2 -2)"><g transform="translate(-4 -4) rotate(-45 16 16)">' +
    '<path d="M16 2 L22.5 15 L21 22 H11 L9.5 15 Z" fill="#101010" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<rect x="10" y="23" width="12" height="5" rx="1" fill="#101010" stroke="#fff" stroke-width="1.5"/>' +
    '<path d="M16 3.5 V12" stroke="#fff" stroke-width="1.2"/><circle cx="16" cy="14" r="1.8" fill="#fff"/></g></g></g>' +
    '<g class="pen-logo__mark pen-logo__mark--new" transform="translate(6 23)" stroke-linecap="round">' +
      '<path d="M0-4V4M-3.5-2 3.5 2M-3.5 2 3.5-2" stroke="#fff" stroke-width="3.6"/><path d="M0-4V4M-3.5-2 3.5 2M-3.5 2 3.5-2" stroke="#101010" stroke-width="1.6"/></g>' +
    '<g class="pen-logo__mark pen-logo__mark--close" transform="translate(6 23)"><circle r="3.4" fill="none" stroke="#fff" stroke-width="3.6"/><circle r="3.4" fill="none" stroke="#101010" stroke-width="1.6"/></g>';
  const marks = { new: pen.querySelector('.pen-logo__mark--new'), close: pen.querySelector('.pen-logo__mark--close') };
  const nib = pen.querySelector('.pen-logo__nib');

  /* ---- Build the session: a list of timed steps ---- */
  let k = 1;                       // viewBox units per screen px
  const steps = [];
  const build = () => {
    const r = svg.getBoundingClientRect();
    k = r.width ? vb[2] / r.width : 1;
    const px = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]) / k;   // distance in screen px
    let cur = [data.w * 0.92, data.h * 0.02];                         // pen enters from the top right
    data.paths.forEach((p, pi) => {
      const nodes = p.n;
      nodes.forEach((node, ni) => {
        const to = pt(node);
        steps.push({ type: 'move', pi, ni, from: cur, to, mark: ni === 0 ? 'new' : null, base: Math.min(520, 140 + px(cur, to) * 2.4) });
        steps.push({ type: 'click', pi, ni, base: 80 });
        cur = to;
        const out = hOut(node);
        if (out) { steps.push({ type: 'drag', pi, ni, from: to, to: out, base: Math.min(380, 170 + px(to, out) * 1.8) }); cur = out; }
      });
      const start = pt(nodes[0]);
      steps.push({ type: 'move', pi, ni: nodes.length, from: cur, to: start, mark: 'close', base: Math.min(520, 140 + px(cur, start) * 2.4) });
      steps.push({ type: 'close', pi, base: 110 });
      steps.push({ type: 'deselect', pi, base: 90 });
      cur = start;
    });

    // Speed ramp (by time, not anchor count): ~2.4s at a human pace, then it eases into a time-lapse.
    // The floor speed is solved so the whole session lands in TOTAL ms.
    const TOTAL = 8000, HUMAN = 2400, TAU = 1600;
    let acc = 0;
    steps.forEach(s => { s.at = acc; acc += s.base; });
    const warp = (s, floor) => s.at < HUMAN ? 1 : floor + (1 - floor) * Math.exp(-(s.at - HUMAN) / TAU);
    const total = floor => steps.reduce((a, s) => a + s.base * warp(s, floor), 0);
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; total(m) > TOTAL ? (hi = m) : (lo = m); }
    let t = 0;
    steps.forEach(s => { s.start = t; s.dur = s.base * warp(s, lo); t += s.dur; });
    return t;
  };

  /* ---- Render ---- */
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);   // hand moves: ease in-out
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  let doneD = '';            // fills of closed, deselected shapes
  let anchorEls = [];
  let lastPath = -1;

  const resetPathChrome = () => { anchorsG.replaceChildren(); anchorEls = []; stroke.setAttribute('d', ''); rubber.setAttribute('d', ''); };
  const addAnchor = (node, show) => {
    const s = 4.5 * k;
    const r = el('rect', { x: node[0] - s / 2, y: node[1] - s / 2, width: s, height: s, class: 'pen-logo__anchor' }, anchorsG);
    r.style.transformOrigin = `${node[0]}px ${node[1]}px`;
    const prev = anchorEls[anchorEls.length - 1];
    if (prev) { prev.classList.remove('is-sel'); if (prev.dataset.tuck) prev.style.display = 'none'; }
    if (!show) r.dataset.tuck = '1';
    r.classList.add('is-sel');      // the newest anchor is the selected (solid) one
    anchorEls.push(r);
  };
  const setHandles = (node, g) => {
    const hs = [hIn(node), hOut(node)];
    hs.forEach((h, i) => {
      const on = h && g > 0;
      const end = on ? lerp(pt(node), h, g) : pt(node);
      hLines[i].setAttribute('x1', node[0]); hLines[i].setAttribute('y1', node[1]);
      hLines[i].setAttribute('x2', end[0]); hLines[i].setAttribute('y2', end[1]);
      hDots[i].setAttribute('cx', end[0]); hDots[i].setAttribute('cy', end[1]);
      hDots[i].setAttribute('r', on ? 2.4 * k : 0);
      hLines[i].style.opacity = on ? 1 : 0;
    });
  };
  const placePen = (p, mark, press = 0) => {
    pen.setAttribute('transform', `translate(${P(p)}) scale(${k})`);
    nib.style.transform = press ? `scale(${1 - .12 * press})` : '';
    marks.new.style.opacity = mark === 'new' ? 1 : 0;
    marks.close.style.opacity = mark === 'close' ? 1 : 0;
  };

  // anchors closer than GAP screen px to the previous visible one are drawn but not shown — keeps small sizes legible
  const GAP = 9;
  let lastShown = null;

  let si = 0;                // current step index
  let placed = 0;            // anchors placed in the current path
  let grow = 0;              // handle growth of the newest anchor
  let closed = false;
  const render = e => {
    // advance through finished steps, applying their end state once
    while (si < steps.length && e >= steps[si].start + steps[si].dur) { finish(steps[si]); si++; }
    if (si >= steps.length) return true;
    const s = steps[si], t = Math.max(0, Math.min(1, (e - s.start) / s.dur));
    const nodes = data.paths[s.pi].n;
    if (s.pi !== lastPath) { lastPath = s.pi; placed = 0; grow = 0; closed = false; lastShown = null; resetPathChrome(); }

    let cursor = pt(nodes[0]), mark = null, press = 0;
    if (s.type === 'move') {
      // a hand doesn't travel in a ruler-straight line: ease in-out along a shallow arc
      const te = ease(t), d = [s.to[0] - s.from[0], s.to[1] - s.from[1]];
      const bow = Math.sin(Math.PI * te) * 0.07 * ((s.ni % 2) ? 1 : -1);
      cursor = [s.from[0] + d[0] * te - d[1] * bow, s.from[1] + d[1] * te + d[0] * bow];
      mark = s.mark;
    } else if (s.type === 'click') {
      cursor = pt(nodes[s.ni]); press = Math.sin(Math.PI * t);
    } else if (s.type === 'drag') {
      grow = easeOut(t); cursor = lerp(s.from, s.to, grow);
    } else if (s.type === 'close') {
      cursor = pt(nodes[0]); press = Math.sin(Math.PI * t); mark = 'close';
    } else {
      cursor = pt(nodes[0]);
    }

    // the live path: placed anchors, newest one's handles growing as it's dragged
    let d = '';
    if (placed > 0) {
      d = `M${P(pt(nodes[0]))}`;
      for (let i = 1; i < placed; i++) d += seg(nodes[i - 1], nodes[i], 1, i === placed - 1 ? grow : 1);
    }
    if (closed) d = fullD(nodes);
    stroke.setAttribute('d', d);
    fill.setAttribute('d', doneD + d);   // open path fills as you draw, like Illustrator

    // rubber band from the last anchor to the pen while moving to the next point
    if (s.type === 'move' && placed > 0) {
      const last = nodes[placed - 1], o = hOut(last);
      const c1 = o ? lerp(pt(last), o, grow) : pt(last);
      rubber.setAttribute('d', `M${P(pt(last))}C${P(c1)} ${P(cursor)} ${P(cursor)}`);
    } else rubber.setAttribute('d', '');

    if (placed > 0) setHandles(nodes[placed - 1], s.type === 'drag' || (s.type === 'move' && hOut(nodes[placed - 1])) ? grow : 0);
    else setHandles([0, 0, null, null, null, null], 0);
    placePen(cursor, mark, press);
    return false;
  };

  const finish = s => {
    const nodes = data.paths[s.pi].n;
    if (s.pi !== lastPath) { lastPath = s.pi; placed = 0; grow = 0; closed = false; lastShown = null; resetPathChrome(); }
    if (s.type === 'click') {
      const node = nodes[s.ni];
      const show = !lastShown || Math.hypot(node[0] - lastShown[0], node[1] - lastShown[1]) >= GAP * k;
      if (show) lastShown = node;
      addAnchor(node, show);
      placed = s.ni + 1; grow = hOut(node) ? 0 : 1;
    } else if (s.type === 'drag') {
      grow = 1;
    } else if (s.type === 'close') {
      closed = true;
      stroke.setAttribute('d', fullD(nodes));
    } else if (s.type === 'deselect') {
      doneD += fullD(nodes);
      fill.setAttribute('d', doneD);
      resetPathChrome();
      setHandles([0, 0, null, null, null, null], 0);
    }
  };

  const run = () => {
    const total = build();
    pen.classList.add('is-on');
    const t0 = performance.now();
    const tick = now => {
      if (destroyed) return;
      if (render(now - t0)) {
        fill.setAttribute('d', finalD);
        pen.classList.remove('is-on');
        chrome.remove();
        penTimer = setTimeout(() => pen.remove(), 600);
        follow();
        return;
      }
      drawRaf = requestAnimationFrame(tick);
    };
    drawRaf = requestAnimationFrame(tick);
    return total;
  };

  /* ---- Look-at: once drawn, the head turns and the eyes follow a nearby pointer ----
     A 2.5D puppet warp on the vector anchors themselves: every anchor and handle is displaced by a smooth field.
     · Head turn: points are given depth from an ellipsoid over the face (nose/eyes/mouth deepest, outline ~0),
       so the face shifts more than the outline — it reads as rotation, not sliding. The crown also tips
       about the base of the neck.
     · Neck: the effect fades from jaw to collar, so the neck bends and the shirt stays put.
     · Eyes: a local shift around each iris on a faster spring — the eyes lead, the head follows.
     Coordinates are in the drawing's own units (img/logo.png crop). */
  const FACE = { cx: 370, cy: 470, rx: 300, ry: 400 };     // depth ellipsoid (front of the face)
  const NECK = { from: 700, to: 900, pivot: 900, top: 15 }; // head weight fades jaw → collar; tilt pivots at neck base
  const IRIS = [[279, 414], [489, 427]], IRIS_SIGMA = 20;
  // max displacement in drawing units — vertical kept smaller: we lower our eyes more than we nod, and the iris must stay tucked under the lid
  const AMP = { turn: 20, tilt: 12, nod: 7, lift: 3, eyeX: 7, eyeY: 2.5 };

  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const warpPoint = (x, y, h, e) => {
    const w = 1 - smooth(NECK.from, NECK.to, y);
    if (w <= 0) return [x, y];
    const u = (x - FACE.cx) / FACE.rx, v = (y - FACE.cy) / FACE.ry;
    const z = Math.sqrt(Math.max(0, 1 - u * u - v * v));            // 0 at the outline → 1 at the front of the face
    const lever = (NECK.pivot - y) / (NECK.pivot - NECK.top);        // crown tips more than the jaw
    let dx = w * (z * h.x * AMP.turn + lever * h.x * AMP.tilt);
    let dy = w * (z * h.y * AMP.nod + lever * h.y * AMP.lift);
    for (const [ix, iy] of IRIS) {
      const g = Math.exp(-((x - ix) ** 2 + (y - iy) ** 2) / (2 * IRIS_SIGMA ** 2));
      dx += g * e.x * AMP.eyeX; dy += g * e.y * AMP.eyeY;
    }
    return [x + dx, y + dy];
  };
  const warpNode = (n, h, e) => {
    const p = warpPoint(n[0], n[1], h, e);
    const i = n[2] == null ? [null, null] : warpPoint(n[2], n[3], h, e);
    const o = n[4] == null ? [null, null] : warpPoint(n[4], n[5], h, e);
    return [p[0], p[1], i[0], i[1], o[0], o[1]];
  };

  // critically-ish damped springs: head heavy and slow, eyes quick
  const spring = (omega, zeta) => ({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, omega, zeta });
  const step = (sp, dt) => {
    for (const k of ['x', 'y']) {
      const v = 'v' + k, t = 't' + k;
      const a = sp.omega * sp.omega * (sp[t] - sp[k]) - 2 * sp.zeta * sp.omega * sp[v];
      sp[v] += a * dt; sp[k] += sp[v] * dt;
    }
    return Math.abs(sp.tx - sp.x) + Math.abs(sp.ty - sp.y) + Math.abs(sp.vx) + Math.abs(sp.vy) > 1e-4;
  };

  function follow() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const head = spring(6.5, 0.85), eyes = spring(17, 0.8);
    const REACH = 260;    // px beyond the portrait where it starts to notice the pointer
    let last = 0;

    const aim = (px, py) => {
      const r = svg.getBoundingClientRect();
      if (!r.width) return;
      // eye line in screen space — where it "looks from"
      const ex = r.left + ((IRIS[0][0] + IRIS[1][0]) / 2 - vb[0]) / vb[2] * r.width;
      const ey = r.top + ((IRIS[0][1] + IRIS[1][1]) / 2 - vb[1]) / vb[3] * r.height;
      const dx = px - ex, dy = py - ey;
      // proximity: full attention over the portrait, fading to nothing REACH px away
      const ox = Math.max(r.left - px, 0, px - r.right), oy = Math.max(r.top - py, 0, py - r.bottom);
      const near = 1 - smooth(0, REACH, Math.hypot(ox, oy));
      // soft-saturating direction; the eyes reach their limit sooner than the head
      const hs = Math.hypot(dx, dy, r.width * .45), es = Math.hypot(dx, dy, r.width * .18);
      head.tx = dx / hs * near; head.ty = dy / hs * near;
      eyes.tx = dx / es * near; eyes.ty = dy / es * near;
      kick();
    };
    const rest = () => { head.tx = head.ty = eyes.tx = eyes.ty = 0; kick(); };

    const frame = now => {
      const dt = Math.min(.033, (now - last) / 1000 || .016); last = now;
      const moving = step(head, dt) | step(eyes, dt);
      const h = { x: head.x, y: head.y }, e = { x: eyes.x, y: eyes.y };
      fill.setAttribute('d', moving || head.tx || head.ty || eyes.tx || eyes.ty
        ? data.paths.map(p => fullD(p.n.map(n => warpNode(n, h, e)))).join('')
        : finalD);
      followRaf = moving ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!followRaf && !destroyed) { last = performance.now(); followRaf = requestAnimationFrame(frame); } };

    listen(window, 'pointermove', e => aim(e.clientX, e.clientY), { passive: true });
    listen(document, 'pointerleave', rest);
    listen(window, 'blur', rest);
  }

  // Started by PenLogo once the preloader lifts, a beat after the headline
  let started = false;
  const start = () => { if (started || destroyed) return; started = true; run(); };
  return { start, destroy };
}
