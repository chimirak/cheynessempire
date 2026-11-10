import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { useSite } from "@/components/providers/SiteProvider";
import { buttonVariants } from "@/components/ui/button";
import { MaskedHeadline } from "@/components/ui/MaskedHeadline";
import { Reveal } from "@/components/ui/Reveal";
import { FINAL_COPY } from "@/data/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { GREETING_MESSAGE, waLink } from "@/lib/whatsapp";

/** Section 9 — the closing feeling, in one espresso space with the footer. */
export function FinalCta() {
  const { scrollToId } = useSite();
  const reduced = useReducedMotion();
  return (
    <section
      data-nav="contact"
      data-theme="dark"
      aria-labelledby="final-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-espresso text-ivory"
    >
      <div aria-hidden className="cx-glow absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.1]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center text-ivory opacity-[0.06]">
        <LogoMark className="h-[78vmin] w-auto" />
      </div>

      <div className="cx-container relative py-24 text-center">
        <MaskedHeadline
          text={FINAL_COPY.headline}
          className="t-section mx-auto max-w-[18ch] text-ivory md:text-[clamp(44px,6vw,96px)]"
          emClassName="text-rose"
          stagger={0.08}
        />
        <span id="final-title" className="sr-only">
          Begin your Cheyness experience
        </span>
        <Reveal delay={0.7} className="mt-14 flex justify-center">
          <a
            href={waLink(GREETING_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "gold", className: "min-h-[60px] px-10 md:px-14" })}
          >
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
              <motion.rect
                x="0.5"
                y="0.5"
                width="99%"
                height="98%"
                fill="none"
                stroke="currentColor"
                className="text-gold"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: reduced ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduced ? 0 : 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
              />
            </svg>
            {FINAL_COPY.cta}
          </a>
        </Reveal>
        <Reveal delay={0.9}>
          <button
            type="button"
            onClick={() => scrollToId("skincare")}
            className="group mt-10 inline-flex min-h-11 items-center gap-2 text-[14px] text-ivory/80 transition-colors hover:text-ivory"
          >
            <span className="cx-link">{FINAL_COPY.back}</span>
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" strokeWidth={1.25} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
