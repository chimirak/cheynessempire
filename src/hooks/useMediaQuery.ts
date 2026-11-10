import { useEffect, useState } from "react";

/** SSR-safe media query: false on the server and first paint, then the real value. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
