import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface CursorState {
  label: string;
  grow: boolean;
  dark: boolean;
  visible: boolean;
}

/**
 * Drives the custom cursor: a dot that follows instantly and a ring that lags.
 * Elements opt in with data-cursor="View" | "Drag" (label) or data-cursor="grow".
 * Dark sections mark themselves with data-theme="dark" so the cursor turns ivory.
 */
export function useCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({
    label: "",
    grow: false,
    dark: false,
    visible: false,
  });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const t = e.target as Element | null;
      const target = t?.closest?.("[data-cursor]") as HTMLElement | null;
      const dark = Boolean(t?.closest?.('[data-theme="dark"]'));
      const raw = target?.dataset["cursor"] ?? "";
      const label = raw === "grow" ? "" : raw;
      const grow = Boolean(target);
      setState((s) =>
        s.label === label && s.grow === grow && s.dark === dark && s.visible
          ? s
          : { label, grow, dark, visible: true },
      );
    };
    const onLeave = () => setState((s) => ({ ...s, visible: false }));
    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  return { enabled, dotRef, ringRef, state };
}
