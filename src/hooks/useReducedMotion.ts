import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/** True when the visitor prefers reduced motion. */
export function useReducedMotion(): boolean {
  return Boolean(useFramerReducedMotion());
}
