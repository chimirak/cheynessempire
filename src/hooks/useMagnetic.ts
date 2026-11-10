import { useEffect, type RefObject } from "react";

/** Pulls an element up to `strength` px toward the pointer (fine pointers only). */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 8, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.transition = "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)";
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0, 0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, strength, enabled]);
}
