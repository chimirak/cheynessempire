import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogoMarkDraw } from "@/components/brand/LogoMark";
import { useSite } from "@/components/providers/SiteProvider";
import { EXHALE } from "@/components/ui/Reveal";

export const ENTRANCE_KEY = "cx-entered";

/**
 * First visit per session: espresso screen, the logo mark draws itself in ivory,
 * then the screen lifts away to reveal the hero.
 */
export function Entrance() {
  const { setIntroDone } = useSite();
  const [phase, setPhase] = useState<"draw" | "lift" | "done">("draw");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(ENTRANCE_KEY) === "1";
      sessionStorage.setItem(ENTRANCE_KEY, "1");
    } catch {
      /* storage unavailable: just play */
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    if (seen) {
      setPhase("done");
      setIntroDone(true);
    } else if (prefersReduced) {
      const t = setTimeout(() => setPhase("lift"), 300);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [setIntroDone]);

  useEffect(() => {
    if (phase === "lift") {
      // Hero reveal begins as the screen lifts.
      const t = setTimeout(() => setIntroDone(true), reduced ? 0 : 250);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [phase, reduced, setIntroDone]);

  return (
    <AnimatePresence onExitComplete={() => setPhase("done")}>
      {phase === "draw" && (
        <motion.div
          key="entrance"
          className="cx-entrance fixed inset-0 z-[200] flex items-center justify-center bg-espresso text-ivory"
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={reduced ? { duration: 0.2 } : { duration: 0.9, ease: EXHALE }}
          aria-hidden
        >
          {!reduced && (
            <LogoMarkDraw
              className="h-28 w-auto md:h-36"
              duration={1.2}
              onComplete={() => setTimeout(() => setPhase("lift"), 250)}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
