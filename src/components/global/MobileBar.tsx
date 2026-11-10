import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSite } from "@/components/providers/SiteProvider";
import { EXHALE } from "@/components/ui/Reveal";
import { GREETING_MESSAGE, waLink } from "@/lib/whatsapp";

/** Mobile only: fixed bar after the hero with My Ritual + WhatsApp. Hides near the footer. */
export function MobileBar() {
  const { ritual, setDrawerOpen, menuOpen } = useSite();
  const [pastHero, setPastHero] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const footer = document.getElementById("contact");
    const io = footer
      ? new IntersectionObserver(([e]) => setNearFooter(Boolean(e?.isIntersecting)), { rootMargin: "0px 0px 120px 0px" })
      : null;
    if (footer && io) io.observe(footer);
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = pastHero && !nearFooter && !menuOpen;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.6, ease: EXHALE }}
          className="fixed inset-x-0 bottom-0 z-[100] grid grid-cols-2 border-t border-gold bg-ivory/95 text-espresso md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="t-btn flex min-h-14 items-center justify-center border-r border-espresso/10"
            aria-live="polite"
          >
            My Ritual ({ritual.length})
          </button>
          <a
            href={waLink(GREETING_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="t-btn flex min-h-14 items-center justify-center bg-espresso text-ivory"
          >
            WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
