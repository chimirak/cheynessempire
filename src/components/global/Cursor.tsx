import { cn } from "@/lib/utils";
import { useCursor } from "@/hooks/useCursor";

/** 14px dot + lagging ring (64px with a label over images and carousels). Fine pointers only. */
export function Cursor() {
  const { enabled, dotRef, ringRef, state } = useCursor();
  if (!enabled) return null;
  const tone = state.dark ? "bg-ivory" : "bg-espresso";
  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 z-[300] transition-opacity duration-300", state.visible ? "opacity-100" : "opacity-0")}>
      <div ref={dotRef} className="absolute left-0 top-0">
        <span
          className={cn(
            "absolute -left-[7px] -top-[7px] block h-[14px] w-[14px] rounded-full transition-[transform,background-color] duration-300 ease-exhale",
            tone,
            state.grow && "scale-[0.45]",
          )}
        />
      </div>
      <div ref={ringRef} className="absolute left-0 top-0">
        <span
          className={cn(
            "absolute -left-8 -top-8 flex h-16 w-16 items-center justify-center rounded-full border transition-[transform,border-color,background-color] duration-[400ms] ease-exhale",
            state.dark ? "border-ivory/70" : "border-espresso/60",
            state.grow ? "scale-100" : "scale-50",
            state.grow && state.label && (state.dark ? "bg-ivory/10" : "bg-ivory/70"),
          )}
        >
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.2em] transition-opacity duration-300",
              state.dark ? "text-ivory" : "text-espresso",
              state.label ? "opacity-100" : "opacity-0",
            )}
          >
            {state.label}
          </span>
        </span>
      </div>
    </div>
  );
}
