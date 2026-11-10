import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { useSite } from "@/components/providers/SiteProvider";
import { ArchImage } from "@/components/ui/ArchImage";
import { MaskedHeadline } from "@/components/ui/MaskedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { LIFESTYLE } from "@/data/images";
import { EXPERIENCE_COPY } from "@/data/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Section 3 — editorial split: sticky arch left, quiet statement right. */
export function Experience() {
  const { scrollToId } = useSite();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const zoom = useTransform(scrollYProgress, [0.25, 0.85], [1, 1.06]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const deepOpacity = useTransform(scrollYProgress, [0, 0.72, 0.92], [1, 1, 0]);

  return (
    <section
      ref={ref}
      data-nav="philosophy"
      aria-labelledby="experience-title"
      className="relative bg-ivory"
    >
      <motion.div aria-hidden className="absolute inset-0 bg-ivory-deep" style={{ opacity: reduced ? 1 : deepOpacity }} />
      <div className="cx-container cx-section relative lg:grid lg:grid-cols-[46%_1fr] lg:gap-[8vw]">
        <div className="lg:sticky lg:top-[12vh] lg:h-[76vh] lg:self-start">
          <ArchImage
            {...LIFESTYLE.shoulderCare}
            scale={reduced ? undefined : zoom}
            cursor="grow"
            className="aspect-[4/5] w-full md:mx-auto md:max-w-[520px] lg:aspect-auto lg:h-full lg:max-w-none"
          />
        </div>

        <div className="relative mt-14 flex flex-col justify-center lg:mt-0 lg:min-h-[130vh]">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 text-espresso opacity-[0.06]"
            style={reduced ? undefined : { y: watermarkY }}
          >
            <LogoMark className="h-[70vw] max-h-[620px] w-auto lg:h-[44vw]" />
          </motion.div>
          <div className="relative">
            <Reveal>
              <p className="t-eyebrow text-sage">{EXPERIENCE_COPY.eyebrow}</p>
            </Reveal>
            <MaskedHeadline
              text={EXPERIENCE_COPY.headline}
              className="t-section mt-6 text-espresso"
              breaks="md"
            />
            <span id="experience-title" className="sr-only">
              {EXPERIENCE_COPY.eyebrow}
            </span>
            <Reveal delay={0.2}>
              <p className="t-body mt-8 text-espresso/80">{EXPERIENCE_COPY.body}</p>
            </Reveal>
            <Reveal delay={0.35}>
              <button
                type="button"
                onClick={() => scrollToId("experience")}
                className="group t-btn mt-10 inline-flex min-h-11 items-center gap-3 text-espresso"
              >
                <span className="cx-link">{EXPERIENCE_COPY.link}</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 ease-exhale group-hover:translate-x-1.5"
                  strokeWidth={1.25}
                />
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
