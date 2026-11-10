import { motion, useScroll, useSpring } from "framer-motion";

/** 2px gold progress line fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-gold"
      style={{ scaleX }}
    />
  );
}
