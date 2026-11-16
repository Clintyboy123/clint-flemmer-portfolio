import { useEffect, useRef } from 'react';
import { useIntro } from '../../context/IntroContext';
import penDraw from '../../lib/penDraw';
import LOGO_PATHS from '../../lib/logoPaths';

// Hero portrait, drawn live with the pen tool (lib/penDraw.js), starting 450 ms after the preloader lifts.
// Once drawn, the head turns and the eyes follow a nearby pointer.
export default function PenLogo() {
  const host = useRef(null);
  const pen = useRef(null);
  const { ready } = useIntro();

  useEffect(() => {
    const p = penDraw(host.current, LOGO_PATHS);
    pen.current = p;
    return () => {
      p.destroy();
      pen.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => pen.current?.start(), 450);
    return () => clearTimeout(t);
  }, [ready]);

  return <div ref={host} className="hero__art" aria-hidden="true" />;
}
