import { cn } from "@/lib/utils";

/** Thin botanical silhouette in sage that sways slowly. Decorative only. */
export function Leaf({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute text-sage", className)}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <svg viewBox="0 0 120 260" className="animate-sway h-full w-full" fill="none">
        <path
          d="M60 258 C 58 200, 62 140, 60 6"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {[
          [60, 210, -1],
          [60, 178, 1],
          [60, 146, -1],
          [60, 114, 1],
          [60, 84, -1],
          [60, 56, 1],
          [60, 30, -1],
        ].map(([x, y, dir], i) => {
          const len = 44 - i * 4;
          const tipX = x + dir * len;
          const tipY = y - len * 0.55;
          return (
            <path
              key={i}
              d={`M${x} ${y} Q ${x + dir * len * 0.45} ${y - len * 0.75}, ${tipX} ${tipY} Q ${x + dir * len * 0.7} ${y - len * 0.05}, ${x} ${y} Z`}
              fill="currentColor"
              fillOpacity={0.55}
            />
          );
        })}
      </svg>
    </div>
  );
}
