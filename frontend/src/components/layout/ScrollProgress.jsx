import { motion, useScroll } from 'motion/react';

// The thin red line along the top that fills as you scroll the page.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="progress" aria-hidden="true" style={{ scaleX: scrollYProgress }} />;
}
