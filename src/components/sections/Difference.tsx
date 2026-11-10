import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MaskedHeadline } from "@/components/ui/MaskedHeadline";
import { EXHALE, Reveal } from "@/components/ui/Reveal";
import { DIFFERENCE_COPY } from "@/data/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Section 7 — restrained and text-led. Columns divided by gold hairlines that draw downward. */
export function Difference() {
  const reduced = useReducedMotion();
  return (
    <section data-nav="experience" aria-labelledby="difference-title" className="bg-ivory">
      <div className="cx-container pb-[160px] pt-[96px] xl:pt-[160px]">
        <MaskedHeadline
          text={DIFFERENCE_COPY.headline}
          className="t-section max-w-[14ch] text-espresso"
        />
        <span id="difference-title" className="sr-only">
          The Cheyness difference
        </span>
        <div className="mt-16 grid md:mt-24 md:grid-cols-3">
          {DIFFERENCE_COPY.columns.map((c, i) => (
            <div key={c.title} className={cn("relative py-10 md:px-10 md:py-4", i === 0 && "md:pl-0")}>
              {i > 0 && (
                <>
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 left-0 hidden w-px origin-top bg-gold md:block"
                    initial={{ scaleY: reduced ? 1 : 0, opacity: reduced ? 0 : 1 }}
                    whileInView={{ scaleY: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: reduced ? 0.2 : 0.8, ease: EXHALE }}
                  />
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px origin-left bg-gold md:hidden"
                    initial={{ scaleX: reduced ? 1 : 0, opacity: reduced ? 0 : 1 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: reduced ? 0.2 : 0.8, ease: EXHALE }}
                  />
                </>
              )}
              <Reveal delay={0.8 + i * 0.15}>
                <h3 className="font-display text-[30px] leading-tight text-espresso md:text-[32px]">{c.title}</h3>
                <p className="t-body mt-4 text-espresso/80">{c.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
