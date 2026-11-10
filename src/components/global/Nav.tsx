import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/LogoMark";
import { useSite } from "@/components/providers/SiteProvider";
import { EXHALE } from "@/components/ui/Reveal";
import { BRAND, CONTACT, NAV_LINKS, type NavId } from "@/data/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { mailtoLink, waLink, GREETING_MESSAGE } from "@/lib/whatsapp";

function useNavState() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<NavId>("home");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-nav]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.getAttribute("data-nav") as NavId);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return { scrolled, hidden, active };
}

export function Nav() {
  const { ritual, setDrawerOpen, scrollToId, menuOpen, setMenuOpen } = useSite();
  const { scrolled, hidden, active } = useNavState();
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(false);
  const prevCount = useRef(ritual.length);

  useEffect(() => {
    if (ritual.length > prevCount.current) {
      setTick(true);
      const t = setTimeout(() => setTick(false), 1400);
      prevCount.current = ritual.length;
      return () => clearTimeout(t);
    }
    prevCount.current = ritual.length;
  }, [ritual.length]);

  const light = !scrolled || menuOpen; // ivory text over hero / menu
  const go = (id: NavId) => {
    setMenuOpen(false);
    setTimeout(() => scrollToId(id), menuOpen ? 450 : 0);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[105] transition-[transform,background-color,border-color,color] duration-500 ease-exhale",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          scrolled && !menuOpen
            ? "border-b border-gold bg-ivory/[0.92] text-espresso backdrop-blur-[2px]"
            : "border-b border-transparent bg-transparent text-ivory",
        )}
      >
        <nav aria-label="Main" className="cx-container flex h-[72px] items-center justify-between lg:h-20">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
            className="flex min-h-11 items-center gap-3"
            aria-label={`${BRAND.name}, back to top`}
          >
            <LogoMark className="h-8 w-auto lg:h-9" />
            <span className="font-display text-[15px] font-medium uppercase tracking-[0.2em] lg:text-[16px]">
              {BRAND.name}
            </span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.id);
                  }}
                  data-active={active === l.id}
                  aria-current={active === l.id ? "true" : undefined}
                  className={cn(
                    "cx-link text-[13px] font-normal tracking-[0.06em] transition-opacity",
                    light ? "text-ivory" : "text-espresso",
                  )}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="cx-link hidden min-h-11 items-center gap-2 text-[13px] font-medium uppercase tracking-[0.18em] md:inline-flex"
            >
              My Ritual
              <span className="relative inline-flex min-w-[2.2ch] justify-center" aria-live="polite">
                (
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={ritual.length}
                    initial={reduced ? { opacity: 0 } : { y: "70%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { y: "-70%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: EXHALE }}
                    className="inline-block"
                  >
                    {ritual.length}
                  </motion.span>
                </AnimatePresence>
                )
                <AnimatePresence>
                  {tick && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EXHALE }}
                      className="absolute -right-4 -top-2 text-gold"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="sr-only"> saved items, open drawer</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative -mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-6 bg-current transition-transform duration-500 ease-exhale",
                  menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-6 bg-current transition-transform duration-500 ease-exhale",
                  menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu active={active} onGo={go} />
    </>
  );
}

function MobileMenu({ active, onGo }: { active: NavId; onGo: (id: NavId) => void }) {
  const { menuOpen, setMenuOpen, ritual, setDrawerOpen } = useSite();
  const reduced = useReducedMotion();
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstLink.current?.focus(), 300);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-theme="dark"
          className="fixed inset-0 z-[104] flex flex-col bg-espresso text-ivory lg:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
          exit={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: reduced ? 0.2 : 0.7, ease: EXHALE }}
        >
          <ul className="cx-container mt-28 flex flex-col gap-3">
            {NAV_LINKS.map((l, i) => (
              <li key={l.id} className="overflow-hidden">
                <motion.a
                  ref={i === 0 ? firstLink : undefined}
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onGo(l.id);
                  }}
                  initial={reduced ? { opacity: 0 } : { y: "110%" }}
                  animate={reduced ? { opacity: 1 } : { y: 0 }}
                  transition={{ duration: reduced ? 0.2 : 0.8, delay: reduced ? 0 : 0.25 + i * 0.07, ease: EXHALE }}
                  className={cn(
                    "block py-1 font-display text-[44px] leading-[1.1]",
                    active === l.id ? "italic text-rose" : "text-ivory",
                  )}
                >
                  {l.label}
                </motion.a>
              </li>
            ))}
          </ul>
          <div className="cx-container mt-auto flex flex-col gap-4 pb-10">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setDrawerOpen(true);
              }}
              className="t-btn flex min-h-11 items-center text-left text-ivory"
            >
              My Ritual ({ritual.length})
            </button>
            <div className="h-px w-full bg-gold/70" />
            <a
              href={waLink(GREETING_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center text-[15px] text-ivory/90"
            >
              WhatsApp · {CONTACT.phoneDisplay}
            </a>
            <a href={mailtoLink} className="flex min-h-11 items-center text-[15px] text-ivory/90">
              {CONTACT.email}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
