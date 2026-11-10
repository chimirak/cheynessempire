import { motion } from "framer-motion";
import { LOGO_PATHS, LOGO_TRANSFORM, LOGO_VIEWBOX } from "./logo-paths";

interface LogoMarkProps {
  className?: string;
  title?: string;
}

/** The Cheyness Empire logo mark. Inherits colour from `currentColor`. */
export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      <g transform={LOGO_TRANSFORM}>
        {LOGO_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** Logo mark that draws itself as a stroke, then fills (page entrance). */
export function LogoMarkDraw({
  className,
  duration = 1.2,
  onComplete,
}: {
  className?: string;
  duration?: number;
  onComplete?: () => void;
}) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} aria-hidden>
      <g transform={LOGO_TRANSFORM}>
        {LOGO_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{
              pathLength: { duration, ease: [0.22, 1, 0.36, 1] },
              fillOpacity: { duration: 0.5, delay: duration * 0.75, ease: "easeOut" },
            }}
            onAnimationComplete={() => {
              if (i === 0) onComplete?.();
            }}
          />
        ))}
      </g>
    </svg>
  );
}
