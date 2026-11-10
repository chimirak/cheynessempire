import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useSite } from "@/components/providers/SiteProvider";
import { Button } from "@/components/ui/button";
import { ArchImage } from "@/components/ui/ArchImage";
import { MaskedHeadline } from "@/components/ui/MaskedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { HERO_COPY } from "@/data/site";
import { LIFESTYLE } from "@/data/images";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HeroImage } from "./HeroImage";

export function Hero() {
  const { introDone, scrollToId } = useSite();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  useMagnetic(ctaRef, 8);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Image travels at ~0.85x scroll speed; text fades away.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, -40]);

  return (
    <section
      ref={ref}
      id="home"
      data-nav="home"
      data-theme="dark"
      aria-label="Welcome"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-espresso text-ivory"
    >
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y: imageY }}>
        <HeroImage play={introDone} />
      </motion.div>

      {/* Espresso scrims for legibility: left 55% on desktop, from the bottom on mobile */}
      <div aria-hidden className="absolute inset-0 [background:var(--scrim-bottom)] md:hidden" />
      <div aria-hidden className="absolute inset-y-0 left-0 hidden w-[55%] [background:var(--scrim-left)] md:block" />
      {/* Bottom edge fades into ivory through a soft 160px gradient */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[160px] [background:var(--fade-to-ivory)] opacity-0 md:opacity-100" />

      {/* Floating arch detail (desktop only) */}
      <motion.div
        className="absolute bottom-[18%] right-[9%] hidden lg:block"
        style={reduced ? undefined : { opacity: textOpacity }}
      >
        <div className="animate-drift">
          <ArchImage
            {...LIFESTYLE.detailLinenJar}
            revealPlay={introDone}
            revealDelay={1.2}
            priority
            cursor="grow"
            className="h-[260px] w-[180px] outline outline-1 outline-offset-8 outline-ivory/40"
          />
        </div>
      </motion.div>

      <motion.div
        className="cx-container absolute inset-x-0 bottom-0 pb-[104px] md:pb-[150px] lg:pb-[170px]"
        style={reduced ? undefined : { opacity: textOpacity, y: textY }}
      >
        <Reveal play={introDone} delay={0.4} y={12}>
          <p className="t-eyebrow text-ivory/85">{HERO_COPY.eyebrow}</p>
        </Reveal>
        <MaskedHeadline
          as="h1"
          text={HERO_COPY.headline}
          play={introDone}
          delay={0.6}
          className="t-hero mt-5 max-w-[11ch] text-ivory md:max-w-none"
          emClassName="text-rose"
        />
        <Reveal play={introDone} delay={1.25}>
          <p className="t-body mt-6 max-w-[44ch] text-ivory/85">{HERO_COPY.support}</p>
        </Reveal>
        <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-10">
          <Reveal play={introDone} delay={1.4} className="w-full sm:w-auto">
            <Button
              ref={ctaRef}
              variant="ivory"
              className="w-full sm:w-auto"
              onClick={() => scrollToId("philosophy")}
            >
              {HERO_COPY.primaryCta}
            </Button>
          </Reveal>
          <Reveal play={introDone} delay={1.55}>
            <button
              type="button"
              onClick={() => scrollToId("skincare")}
              data-underline="always"
              className="cx-link t-btn min-h-11 text-ivory"
            >
              {HERO_COPY.secondaryCta}
            </button>
          </Reveal>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div aria-hidden className="absolute bottom-6 left-1/2 hidden h-12 w-px -translate-x-1/2 bg-espresso/30 md:block">
        <span className="animate-cue absolute -left-[2px] top-0 block h-[5px] w-[5px] rounded-full bg-espresso" />
      </div>
    </section>
  );
}
