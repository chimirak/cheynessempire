import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Leaf } from "@/components/brand/Leaf";
import { ArchImage } from "@/components/ui/ArchImage";
import { Reveal } from "@/components/ui/Reveal";
import { LIFESTYLE } from "@/data/images";
import { SELF_LOVE_COPY } from "@/data/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Img = (typeof LIFESTYLE)[keyof typeof LIFESTYLE];

function ParallaxArch({
  img,
  progress,
  speed,
  className,
}: {
  img: Img;
  progress: MotionValue<number>;
  speed: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const travel = (1 - speed) * 520; // px across the section
  const y = useTransform(progress, [0, 1], [-travel / 2, travel / 2]);
  const scale = useTransform(progress, [0, 0.55], [0.94, 1]);
  return (
    <motion.div className={cn("group", className)} style={reduced ? undefined : { y, scale }}>
      <ArchImage
        {...img}
        cursor="grow"
        className="h-full w-full"
        imgClassName="scale-[1.08] transition-transform duration-700 ease-exhale group-hover:translate-x-3"
      />
    </motion.div>
  );
}

/** Section 2 — one oversized statement that lights up word by word as you scroll. */
export function SelfLove() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const deepOpacity = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  // Scroll-linked text fill (GSAP ScrollTrigger, scrubbed)
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.querySelectorAll<HTMLElement>("[data-word]").forEach((w) => (w.style.opacity = "1"));
      el.querySelectorAll<HTMLElement>("[data-lit]").forEach((w) => (w.style.opacity = "1"));
      return;
    }
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 38%", scrub: 0.6 },
        });
        words.forEach((w) => {
          tl.to(w, { opacity: 1, duration: 1, ease: "none" });
          const lit = w.querySelector("[data-lit]");
          if (lit) tl.to(lit, { opacity: 1, duration: 1, ease: "none" }, "<");
        });
      }, el);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={ref}
      id="philosophy"
      data-nav="philosophy"
      aria-label="Our philosophy"
      className="relative overflow-hidden bg-ivory lg:min-h-[180vh]"
    >
      <motion.div aria-hidden className="absolute inset-0 bg-ivory-deep" style={{ opacity: reduced ? 0.6 : deepOpacity }} />

      <div className="cx-container cx-section relative lg:pb-[220px] lg:pt-[240px]">
        <h2 ref={textRef} className="t-statement relative z-10 text-espresso">
          {SELF_LOVE_COPY.lines.map((line, li) => (
            <span key={li} className={cn("block", li === 1 && "lg:pl-[8vw]", li === 3 && "lg:pl-[16vw]")}>
              {line.split(" ").map((word, wi) => {
                const em = word === SELF_LOVE_COPY.emphasis;
                return (
                  <span key={wi}>
                    <span data-word className="relative inline-block opacity-[0.18]">
                      <span className={cn(em && "italic")}>{word}</span>
                      {em && (
                        <span data-lit aria-hidden className="absolute inset-0 italic text-rose opacity-0">
                          {word}
                        </span>
                      )}
                    </span>{" "}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>

        <Reveal className="relative z-10 mt-12 lg:ml-[46vw] lg:mt-20">
          <p className="t-body max-w-[38ch] text-espresso/80">{SELF_LOVE_COPY.sub}</p>
        </Reveal>

        {/* Mobile: two arches only, composed under the statement */}
        <div className="mt-16 grid grid-cols-2 gap-5 lg:hidden">
          <ArchImage {...LIFESTYLE.waterHands} className="aspect-[3/4.4] w-full" />
          <ArchImage {...LIFESTYLE.leavesLight} className="mt-16 aspect-[3/4.4] w-full" />
        </div>
      </div>

      {/* Desktop: three arches drifting at different speeds, staggered around the type */}
      <div aria-hidden={false} className="pointer-events-none absolute inset-0 hidden lg:block">
        <ParallaxArch
          img={LIFESTYLE.waterHands}
          progress={scrollYProgress}
          speed={0.7}
          className="pointer-events-auto absolute right-[5vw] top-[6%] h-[25vw] w-[18vw]"
        />
        <ParallaxArch
          img={LIFESTYLE.linenBowl}
          progress={scrollYProgress}
          speed={1.15}
          className="pointer-events-auto absolute right-[25vw] top-[44%] h-[19vw] w-[14vw]"
        />
        <ParallaxArch
          img={LIFESTYLE.leavesLight}
          progress={scrollYProgress}
          speed={0.9}
          className="pointer-events-auto absolute bottom-[3%] left-[7vw] h-[26vw] w-[22vw]"
        />
      </div>

      <Leaf className="-right-6 bottom-10 h-56 w-28 opacity-70 lg:right-8" />
    </section>
  );
}
