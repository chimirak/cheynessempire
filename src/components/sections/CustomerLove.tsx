import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EXHALE, Reveal } from "@/components/ui/Reveal";
import { QUOTES, SAMPLE_LABEL } from "@/data/quotes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Section 8 — sample testimonials (clearly labelled placeholders). */
export function CustomerLove() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const q = QUOTES[i] ?? QUOTES[0]!;
  const go = (n: number) => setI((n + QUOTES.length) % QUOTES.length);

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setTimeout(() => go(i + 1), 7000);
    return () => window.clearTimeout(t);
  }, [i, paused, reduced]);

  return (
    <section
      data-nav="experience"
      aria-labelledby="love-title"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(i + 1);
        if (e.key === "ArrowLeft") go(i - 1);
      }}
    >
      <div className="cx-container cx-section relative text-center">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[40px] -translate-x-1/2 select-none font-display text-[360px] leading-none text-rose opacity-[0.12] md:top-[60px] md:text-[520px]"
        >
          &ldquo;
        </span>
        <Reveal>
          <h2 id="love-title" className="t-eyebrow relative text-sage">
            Customer love
          </h2>
        </Reveal>

        <motion.div
          className="relative mx-auto mt-12 min-h-[300px] max-w-[880px] touch-pan-y md:min-h-[280px]"
          drag={reduced ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(i + 1);
            else if (info.offset.x > 60) go(i - 1);
          }}
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={q.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: reduced ? 0.2 : 0.6, ease: EXHALE }}
              aria-live={paused ? "polite" : "off"}
            >
              <blockquote className="font-display text-[30px] italic leading-[1.2] text-espresso md:text-[40px]">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8">
                <span className="block text-[15px] text-espresso">
                  {q.name} · {q.place}
                </span>
                <span className="mt-2 block text-[12px] tracking-[0.04em] text-sage">{SAMPLE_LABEL}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </motion.div>

        <div role="tablist" aria-label="Choose a testimonial" className="relative mt-10 flex justify-center gap-3">
          {QUOTES.map((x, n) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-label={`Sample testimonial ${n + 1}`}
              onClick={() => go(n)}
              className={cn(
                "relative flex h-12 w-12 items-center justify-center border text-[12px] font-medium tracking-[0.12em] transition-colors duration-300",
                n === i
                  ? "border-espresso bg-espresso text-ivory"
                  : "border-espresso/30 text-espresso hover:border-espresso",
              )}
            >
              {x.initials}
              <span className="absolute bottom-0.5 right-1 text-[9px] opacity-70">{n + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
