import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Leaf } from "@/components/brand/Leaf";
import { useSite } from "@/components/providers/SiteProvider";
import { ArchImage } from "@/components/ui/ArchImage";
import { EXHALE, Reveal } from "@/components/ui/Reveal";
import { RITUAL_COPY, RITUAL_STEPS } from "@/data/ritual";

/** Section 5 — the emotional centre. Pinned four-chapter sequence on desktop, stacked on mobile. */
export function Ritual() {
  return (
    <section
      id="experience"
      data-nav="experience"
      data-theme="dark"
      aria-labelledby="ritual-title"
      className="relative bg-espresso text-ivory"
    >
      <h2 id="ritual-title" className="sr-only">
        {RITUAL_COPY.eyebrow}: Cleanse, Nourish, Moisturise, Glow
      </h2>
      <PinnedRitual />
      <StackedRitual />
    </section>
  );
}

function PinnedRitual() {
  const { lenisRef } = useSite();
  const pinRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTriggerType | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  activeRef.current = active;

  useEffect(() => {
    let cancelled = false;
    let mm: { revert: () => void } | undefined;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !pinRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const m = gsap.matchMedia();
      mm = m;
      m.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(RITUAL_STEPS.length - 1, Math.floor(self.progress * RITUAL_STEPS.length));
            if (next !== activeRef.current) setActive(next);
          },
        });
        stRef.current = st;
        return () => {
          stRef.current = null;
        };
      });
      ScrollTrigger.refresh();
    })();
    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  const jump = useCallback(
    (i: number) => {
      const st = stRef.current;
      if (!st) return;
      const target = st.start + (st.end - st.start) * ((i + 0.5) / RITUAL_STEPS.length);
      if (lenisRef.current) lenisRef.current.scrollTo(target, { duration: 1.2 });
      else window.scrollTo({ top: target, behavior: "smooth" });
    },
    [lenisRef],
  );

  // Arrow keys advance chapters while the sequence is pinned.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = stRef.current;
      if (!st?.isActive) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const a = activeRef.current;
      if ((e.key === "ArrowDown" || e.key === "ArrowRight") && a < RITUAL_STEPS.length - 1) {
        e.preventDefault();
        jump(a + 1);
      } else if ((e.key === "ArrowUp" || e.key === "ArrowLeft") && a > 0) {
        e.preventDefault();
        jump(a - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  const step = RITUAL_STEPS[active] ?? RITUAL_STEPS[0]!;

  return (
    <div className="hidden lg:motion-safe:block">
      <div ref={pinRef} className="relative h-screen overflow-hidden">
        {/* Progress rail */}
        <div className="absolute left-10 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center xl:left-12">
          <span aria-hidden className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-gold/35" />
          <ul className="relative flex flex-col gap-10">
            {RITUAL_STEPS.map((s, i) => (
              <li key={s.number}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-label={`Chapter ${s.number}: ${s.word}`}
                  aria-current={i === active ? "step" : undefined}
                  className="group relative flex h-11 w-11 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block h-[9px] w-[9px] rounded-full border border-gold transition-colors duration-500",
                      i === active ? "bg-gold" : "bg-espresso group-hover:bg-gold/40",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="cx-container grid h-full grid-cols-12 items-center">
          <div className="col-span-6 col-start-2 xl:col-start-2">
            <p className="t-eyebrow text-ivory/70">{RITUAL_COPY.eyebrow}</p>
            <div className="mt-8 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={step.number}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.6, ease: EXHALE }}
                  className="font-display text-[clamp(140px,17vw,260px)] leading-[0.85] tracking-[-0.03em] text-ivory"
                >
                  {step.number}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="cx-mask mt-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={step.word}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-110%" }}
                  transition={{ duration: 0.6, ease: EXHALE, delay: 0.05 }}
                  className="font-display text-[clamp(48px,5vw,80px)] italic leading-none text-rose"
                >
                  {step.word}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-8 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={step.line}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: EXHALE, delay: 0.1 }}
                  className="t-body text-ivory/85"
                >
                  {step.line}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative col-span-5 col-start-8 flex justify-end">
            <div aria-hidden className="cx-glow animate-breathe absolute -inset-[18%] opacity-[0.08]" />
            <div className="cx-arch relative h-[80vh] w-[min(38vw,62vh)]" data-cursor="grow">
              {RITUAL_STEPS.map((s, i) => (
                <motion.img
                  key={s.number}
                  src={s.image.src}
                  alt={i === active ? s.image.alt : ""}
                  aria-hidden={i !== active}
                  width={s.image.width}
                  height={s.image.height}
                  loading="lazy"
                  decoding="async"
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.04 }}
                  transition={{ duration: 1, ease: EXHALE }}
                  style={{ objectPosition: s.image.position }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        <Leaf className="bottom-0 left-[38%] h-64 w-32 opacity-50" />
        <Leaf flip className="right-4 top-10 h-48 w-24 opacity-40" />
      </div>
    </div>
  );
}

function StackedRitual() {
  return (
    <div className="cx-container cx-section lg:motion-safe:hidden">
      <p className="t-eyebrow text-ivory/70">{RITUAL_COPY.eyebrow}</p>
      <ol className="mt-12 flex flex-col gap-24 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-24">
        {RITUAL_STEPS.map((s, i) => (
          <li key={s.number} className={cn(i % 2 === 1 && "md:mt-24")}>
            <ArchImage {...s.image} className="aspect-[3/4] w-full" />
            <Reveal className="mt-8 flex items-baseline gap-5">
              <span className="font-display text-[88px] leading-none text-ivory">{s.number}</span>
              <span className="font-display text-[40px] italic leading-none text-rose">{s.word}</span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body mt-4 text-ivory/85">{s.line}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
