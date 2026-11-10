import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Leaf } from "@/components/brand/Leaf";
import { useSite } from "@/components/providers/SiteProvider";
import { Button } from "@/components/ui/button";
import { MaskedHeadline } from "@/components/ui/MaskedHeadline";
import { ProductCard } from "@/components/ui/ProductCard";
import { EXHALE, Reveal } from "@/components/ui/Reveal";
import {
  FOCUS_OPTIONS,
  PACE_OPTIONS,
  getRecommendations,
  type FocusId,
  type PaceId,
} from "@/data/consultation";
import { CONSULT_COPY } from "@/data/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { consultationMessage, waLink } from "@/lib/whatsapp";

type Step = 0 | 1 | 2;

/** Section 6 — a calm, one-question-at-a-time consultation. */
export function Consultation() {
  const { addToRitual, openProduct, setDrawerOpen } = useSite();
  const reduced = useReducedMotion();
  const [step, setStep] = useState<Step>(0);
  const [dir, setDir] = useState(1);
  const [focus, setFocus] = useState<FocusId | null>(null);
  const [pace, setPace] = useState<PaceId | null>(null);
  const [addedAll, setAddedAll] = useState(false);

  const go = (s: Step, d = 1) => {
    setDir(d);
    setStep(s);
  };
  const pick = <T,>(set: (v: T) => void, v: T, nextStep: Step) => {
    set(v);
    window.setTimeout(() => go(nextStep), reduced ? 0 : 380);
  };
  const restart = () => {
    setFocus(null);
    setPace(null);
    setAddedAll(false);
    go(0, -1);
  };

  const result = focus && pace ? getRecommendations(focus, pace) : null;

  const slide = {
    enter: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduced ? { opacity: 0 } : { opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  return (
    <section aria-labelledby="consult-title" data-nav="experience" className="relative overflow-hidden bg-espresso">
      {/* Espresso → ivory wipe with an upward clip-path reveal */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ivory"
        initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
        whileInView={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: reduced ? 0.2 : 0.9, ease: EXHALE }}
      />
      <div className="cx-container cx-section relative">
        <div className="relative mx-auto max-w-[920px] bg-ivory-deep px-5 py-14 md:px-14 md:py-20 lg:px-20">
          {/* Gold progress line */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-espresso/10">
            <motion.div
              className="h-full origin-left bg-gold"
              animate={{ scaleX: step / 2 }}
              initial={false}
              transition={{ duration: 0.8, ease: EXHALE }}
            />
          </div>

          <div className="text-center">
            <Reveal>
              <p className="t-eyebrow text-sage">{CONSULT_COPY.eyebrow}</p>
            </Reveal>
            <span id="consult-title" className="sr-only">
              {CONSULT_COPY.eyebrow}
            </span>
          </div>

          <div className="relative mt-8 min-h-[420px]" aria-live="polite">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              {step === 0 && (
                <motion.div
                  key="s0"
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduced ? 0.2 : 0.5, ease: EXHALE }}
                >
                  <MaskedHeadline
                    text={CONSULT_COPY.headline}
                    className="t-section mx-auto max-w-[16ch] text-center text-espresso"
                    breaks="md"
                  />
                  <div className="mx-auto mt-12 grid max-w-[720px] gap-4 md:grid-cols-2">
                    {FOCUS_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        className="cx-tile md:min-h-[96px]"
                        aria-pressed={focus === o.id}
                        onClick={() => pick(setFocus, o.id, 1)}
                      >
                        <span className="font-display text-[22px] leading-tight md:text-[24px]">{o.label}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 opacity-60" strokeWidth={1.25} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="s1"
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduced ? 0.2 : 0.5, ease: EXHALE }}
                  className="text-center"
                >
                  <h3 className="t-section mx-auto max-w-[16ch] text-espresso">
                    How do you like your <em className="italic">routine?</em>
                  </h3>
                  <div className="mx-auto mt-12 grid max-w-[620px] gap-4 md:grid-cols-2">
                    {PACE_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        className="cx-tile md:min-h-[96px]"
                        aria-pressed={pace === o.id}
                        onClick={() => pick(setPace, o.id, 2)}
                      >
                        <span className="font-display text-[22px] md:text-[24px]">{o.label}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 opacity-60" strokeWidth={1.25} />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => go(0, -1)}
                    className="cx-link mt-10 inline-flex min-h-11 items-center gap-2 text-[14px] text-espresso/75"
                  >
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.25} /> Back
                  </button>
                </motion.div>
              )}

              {step === 2 && result && (
                <motion.div
                  key="s2"
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduced ? 0.2 : 0.5, ease: EXHALE }}
                  className="text-center"
                >
                  <h3 className="t-section text-espresso">
                    A place to <em className="italic">begin</em>
                  </h3>
                  <p className="t-body mx-auto mt-5 text-espresso/80">{result.intro}</p>
                  <div
                    className={
                      "mx-auto mt-12 grid gap-6 text-left " +
                      (result.products.length === 3
                        ? "max-w-[760px] grid-cols-2 md:grid-cols-3"
                        : "max-w-[520px] grid-cols-2")
                    }
                  >
                    {result.products.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
                        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        transition={{ duration: reduced ? 0.2 : 0.8, delay: reduced ? 0 : 0.25 + i * 0.1, ease: EXHALE }}
                      >
                        <ProductCard product={p} onOpen={openProduct} variant="mini" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="mx-auto mt-10 max-w-[52ch] text-[14px] leading-relaxed text-espresso/75">
                    {CONSULT_COPY.disclaimer}
                  </p>
                  <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                    <Button
                      variant="espresso"
                      onClick={() => {
                        if (addedAll) setDrawerOpen(true);
                        else {
                          addToRitual(result.products.map((p) => p.id));
                          setAddedAll(true);
                        }
                      }}
                    >
                      {addedAll ? "Added · View My Ritual" : "Add all to My Ritual"}
                    </Button>
                    <Button variant="outline" asChild>
                      <a
                        href={waLink(consultationMessage(result.products.map((p) => p.name)))}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Talk to us on WhatsApp
                      </a>
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={restart}
                    className="cx-link mt-8 inline-flex min-h-11 items-center text-[14px] text-espresso/75"
                  >
                    Start again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Leaf className="-bottom-4 -left-8 hidden h-52 w-24 opacity-60 md:block" />
        </div>
      </div>
    </section>
  );
}
