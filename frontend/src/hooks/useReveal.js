import { useRef } from 'react';
import { useInView } from 'motion/react';
import { useIntro } from '../context/IntroContext';

// When a block should play its entrance (the CSS in site.css does the animation once it gets the class "in"):
//   load = false: the first time it scrolls into view (same trigger as the original: 12% up from the bottom, 8% visible)
//   load = true:  part of the first screen, so it plays as the preloader lifts
export default function useReveal({ load = false } = {}) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -12% 0px', amount: 0.08 });
  const { revealed } = useIntro();
  return [ref, load ? revealed : seen];
}
