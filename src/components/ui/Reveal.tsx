import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const EXHALE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  as?: "div" | "p" | "span" | "li";
  /** If set, animate when this becomes true instead of on entering view. */
  play?: boolean;
}

/** Body-copy reveal: fades up 24px once, with the long "exhale" ease. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.9,
  as = "div",
  play,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = motion[as];
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y };
  const shown = reduced ? { opacity: 1 } : { opacity: 1, y: 0 };
  const transition = reduced
    ? { duration: 0.2, delay: 0 }
    : { duration, delay, ease: EXHALE };
  const trigger =
    play === undefined
      ? { whileInView: shown, viewport: { once: true, margin: "-10% 0px -10% 0px" } }
      : { animate: play ? shown : hidden };
  return (
    <Comp className={className} initial={hidden} transition={transition} {...trigger}>
      {children}
    </Comp>
  );
}
