import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type Lenis from "lenis";

interface SiteContextValue {
  ritual: string[];
  addToRitual: (ids: string | string[]) => void;
  removeFromRitual: (id: string) => void;
  inRitual: (id: string) => boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  activeProductId: string | null;
  openProduct: (id: string) => void;
  closeProduct: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  introDone: boolean;
  setIntroDone: (done: boolean) => void;
  scrollToId: (id: string) => void;
  lenisRef: React.MutableRefObject<Lenis | null>;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [ritual, setRitual] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (async () => {
      const [{ default: LenisCtor }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      if (reduced) return;
      const lenis = new LenisCtor({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 3.2) });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisRef.current = null;
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // Pause page scrolling while an overlay is open (or the entrance is playing).
  const locked = drawerOpen || Boolean(activeProductId) || menuOpen || !introDone;
  useEffect(() => {
    const lenis = lenisRef.current;
    if (locked) lenis?.stop();
    else lenis?.start();
  }, [locked]);

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.6, offset: 0 });
    } else {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  }, []);

  const addToRitual = useCallback((ids: string | string[]) => {
    const list = Array.isArray(ids) ? ids : [ids];
    setRitual((cur) => [...cur, ...list.filter((id) => !cur.includes(id))]);
  }, []);
  const removeFromRitual = useCallback(
    (id: string) => setRitual((cur) => cur.filter((x) => x !== id)),
    [],
  );

  const value = useMemo<SiteContextValue>(
    () => ({
      ritual,
      addToRitual,
      removeFromRitual,
      inRitual: (id) => ritual.includes(id),
      drawerOpen,
      setDrawerOpen,
      activeProductId,
      openProduct: (id) => setActiveProductId(id),
      closeProduct: () => setActiveProductId(null),
      menuOpen,
      setMenuOpen,
      introDone,
      setIntroDone,
      scrollToId,
      lenisRef,
    }),
    [ritual, addToRitual, removeFromRitual, drawerOpen, activeProductId, menuOpen, introDone, scrollToId],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
