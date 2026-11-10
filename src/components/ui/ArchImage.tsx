import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EXHALE } from "./Reveal";

interface ArchImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
  /** Sizing/positioning of the arch frame */
  className?: string;
  imgClassName?: string;
  /** Clip-path reveal rising from the base when it enters view */
  reveal?: boolean;
  revealPlay?: boolean;
  revealDelay?: number;
  priority?: boolean;
  /** Optional scroll-driven scale (e.g. slow zoom while sticky) */
  scale?: MotionValue<number>;
  cursor?: "View" | "Drag" | "grow";
  sizes?: string;
}

/** THE ARCH: spa-doorway image mask, fully rounded top and square bottom. */
export function ArchImage({
  src,
  alt,
  width,
  height,
  position = "50% 50%",
  className,
  imgClassName,
  reveal = true,
  revealPlay,
  revealDelay = 0,
  priority = false,
  scale,
  cursor,
}: ArchImageProps) {
  const reduced = useReducedMotion();
  const hidden = reduced ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" };
  const shown = reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" };
  const trigger = !reveal
    ? {}
    : revealPlay === undefined
      ? { initial: hidden, whileInView: shown, viewport: { once: true, margin: "-10% 0px" } }
      : { initial: hidden, animate: revealPlay ? shown : hidden };

  return (
    <div
      className={cn("cx-arch relative bg-ivory-deep", className)}
      data-cursor={cursor}
    >
      <motion.div
        className="absolute inset-0"
        transition={reduced ? { duration: 0.2 } : { duration: 1.1, delay: revealDelay, ease: EXHALE }}
        {...trigger}
      >
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{ objectPosition: position, scale }}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </motion.div>
    </div>
  );
}
