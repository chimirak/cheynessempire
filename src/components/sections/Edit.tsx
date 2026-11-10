import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSite } from "@/components/providers/SiteProvider";
import { MaskedHeadline } from "@/components/ui/MaskedHeadline";
import { ProductCard } from "@/components/ui/ProductCard";
import { EXHALE, Reveal } from "@/components/ui/Reveal";
import { CATEGORIES, PRODUCTS, type Category } from "@/data/products";
import { EDIT_COPY } from "@/data/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const pad = (n: number) => String(n).padStart(2, "0");

/** Section 4 — the edit: category tabs above a draggable, snapping carousel. */
export function Edit() {
  const { openProduct } = useSite();
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<"All" | Category>("All");
  const items = tab === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === tab);
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0, lastX: 0, lastT: 0, v: 0, moved: false });

  // Background deepens to espresso as the ritual begins.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["end end", "end start"] });
  const espressoOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);

  const cards = () => Array.from(trackRef.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []);

  const nearestIndex = (left: number) => {
    const cs = cards();
    if (!cs.length) return 0;
    const base = cs[0]!.offsetLeft;
    let best = 0;
    cs.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - base - left) < Math.abs(cs[best]!.offsetLeft - base - left)) best = i;
    });
    return best;
  };

  const scrollToIndex = useCallback(
    (i: number) => {
      const el = trackRef.current;
      const cs = cards();
      if (!el || !cs.length) return;
      const clamped = Math.max(0, Math.min(cs.length - 1, i));
      el.scrollTo({ left: cs[clamped]!.offsetLeft - cs[0]!.offsetLeft, behavior: reduced ? "auto" : "smooth" });
      setIndex(clamped);
    },
    [reduced],
  );

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
    setIndex(atEnd ? items.length - 1 : nearestIndex(el.scrollLeft));
  };

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    setIndex(0);
  }, [tab]);

  // Mouse drag with inertia + snap (touch uses native swipe + scroll-snap).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current!;
    Object.assign(drag.current, {
      down: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
    });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.down || !el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      el.style.scrollSnapType = "none";
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) {
      el.scrollLeft = d.startScroll - dx;
      const now = performance.now();
      const dt = now - d.lastT;
      if (dt > 0) d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v;
      d.lastX = e.clientX;
      d.lastT = now;
    }
  };
  const endDrag = () => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.down || !el) return;
    d.down = false;
    if (!d.moved) return;
    const projected = el.scrollLeft - d.v * 380;
    const target = nearestIndex(projected);
    const cs = cards();
    if (cs[target] && cs[0]) el.scrollTo({ left: cs[target].offsetLeft - cs[0].offsetLeft, behavior: "smooth" });
    setIndex(target);
    window.setTimeout(() => {
      el.style.scrollSnapType = "";
    }, 700);
  };

  return (
    <section
      ref={sectionRef}
      id="skincare"
      data-nav="skincare"
      aria-labelledby="edit-title"
      className="relative overflow-hidden bg-ivory pb-[34vh]"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-espresso" style={{ opacity: espressoOpacity }} />
      <div className="relative cx-section">
        <div className="cx-container flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="t-eyebrow text-sage">{EDIT_COPY.eyebrow}</p>
            </Reveal>
            <MaskedHeadline text={EDIT_COPY.headline} className="t-section mt-6 text-espresso" />
            <span id="edit-title" className="sr-only">
              {EDIT_COPY.eyebrow}
            </span>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between lg:gap-16">
            <div role="tablist" aria-label="Filter products by category" className="flex gap-7">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  type="button"
                  aria-selected={tab === c}
                  aria-controls="edit-carousel"
                  onClick={() => setTab(c)}
                  data-active={tab === c}
                  className={cn(
                    "cx-link t-btn min-h-11 transition-colors",
                    tab === c ? "text-espresso" : "text-espresso/60 hover:text-espresso",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-5 md:flex">
              <span className="t-eyebrow tabular-nums text-espresso" aria-live="polite">
                {pad(index + 1)} / {pad(items.length)}
              </span>
              <button
                type="button"
                onClick={() => scrollToIndex(index - 1)}
                disabled={index === 0}
                aria-label="Previous product"
                className="inline-flex h-11 w-11 items-center justify-center border border-espresso/25 text-espresso transition-colors hover:border-espresso disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(index + 1)}
                disabled={index >= items.length - 1}
                aria-label="Next product"
                className="inline-flex h-11 w-11 items-center justify-center border border-espresso/25 text-espresso transition-colors hover:border-espresso disabled:opacity-30"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              id="edit-carousel"
              ref={trackRef}
              role="region"
              aria-roledescription="carousel"
              aria-label={`${tab === "All" ? "All products" : tab}. Use left and right arrow keys to browse.`}
              tabIndex={0}
              data-cursor="Drag"
              onScroll={onScroll}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              onClickCapture={(e) => {
                if (drag.current.moved) {
                  e.preventDefault();
                  e.stopPropagation();
                  drag.current.moved = false;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  scrollToIndex(index + 1);
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  scrollToIndex(index - 1);
                }
              }}
              className="no-scrollbar relative mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-pl-5 px-5 pb-6 select-none md:mt-20 md:scroll-pl-14 md:gap-6 md:px-14 xl:scroll-pl-24 xl:gap-10 xl:px-24"
            >
              {items.map((p, i) => (
                <motion.div
                  key={p.id}
                  data-card
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
                  whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={
                    reduced ? { duration: 0.2 } : { duration: 0.9, delay: Math.min(i, 4) * 0.1, ease: EXHALE }
                  }
                  className={cn(
                    "w-[78vw] shrink-0 snap-start md:w-[calc((100vw-136px)/2)] xl:w-[25vw]",
                    i % 2 === 1 && "mt-8 md:mt-14",
                  )}
                >
                  <ProductCard product={p} onOpen={openProduct} />
                </motion.div>
              ))}
              <div aria-hidden className="w-px shrink-0" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile: progress line instead of a counter */}
        <div className="cx-container mt-6 md:hidden">
          <div className="relative h-px w-full bg-espresso/15" aria-hidden>
            <div
              className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-500 ease-exhale"
              style={{ width: `${((index + 1) / items.length) * 100}%` }}
            />
          </div>
          <p className="sr-only" aria-live="polite">
            Product {index + 1} of {items.length}
          </p>
        </div>
      </div>
    </section>
  );
}
