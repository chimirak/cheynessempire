import { motion } from "framer-motion";
import { useState } from "react";
import { EXHALE } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ─────────────────────────────────────────────────────────────────────────────
// SWAP POINT FOR THE FINAL HERO PHOTO
// Replace /src/assets/hero-spa.jpg (landscape, ~2000×1333, subject on the right third)
// and /src/assets/hero-spa-portrait.jpg (4:5 mobile crop) with the commissioned photo.
// Current file: royalty-free Unsplash spa portrait used as a stand-in.
// ─────────────────────────────────────────────────────────────────────────────
import heroDesktop from "@/assets/hero-spa.jpg";
import heroPortrait from "@/assets/hero-spa-portrait.jpg";

export const HERO_IMAGE = {
  desktop: heroDesktop,
  portrait: heroPortrait,
  width: 2000,
  height: 1333,
  alt: "A woman with deep-brown skin rests her eyes, one hand softly touching her face in warm light.",
};

// Tiny blurred preview shown while the full photo loads.
const BLUR_PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAQABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDmLaLdcMUbb5Y3Zx0xVtIIWszI8bGWQkgnnPvTIdsMLwoQzMMSP7egqxc/6TBEbeMR4JXaD0GOtYN6m8VZGIwCvgjgGippY4zMQrEoDxRWhnsf/9k=";

/** Swap-ready hero photo: eager, preloaded, blur placeholder, slow 1.12 → 1 settle. */
export function HeroImage({ play }: { play: boolean }) {
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
      animate={
        play ? (reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }) : undefined
      }
      transition={{ duration: reduced ? 0.2 : 1.6, ease: EXHALE }}
    >
      <div
        aria-hidden
        className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl transition-opacity duration-700"
        style={{ backgroundImage: `url(${BLUR_PLACEHOLDER})`, opacity: loaded ? 0 : 1 }}
      />
      <motion.picture
        className="absolute inset-0 block"
        initial={reduced ? false : { scale: 1.12 }}
        animate={play && !reduced ? { scale: 1 } : undefined}
        transition={{ duration: 2.4, ease: EXHALE }}
      >
        <source media="(max-width: 767px)" srcSet={HERO_IMAGE.portrait} />
        <img
          src={HERO_IMAGE.desktop}
          alt={HERO_IMAGE.alt}
          width={HERO_IMAGE.width}
          height={HERO_IMAGE.height}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="h-full w-full object-cover object-[50%_30%] md:object-[50%_35%]"
        />
      </motion.picture>
    </motion.div>
  );
}
