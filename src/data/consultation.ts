import { getProduct, type Product } from "@/data/products";

export type FocusId = "clear" | "body" | "stretch" | "full";
export type PaceId = "simple" | "indulgent";

export const FOCUS_OPTIONS: { id: FocusId; label: string; productIds: string[] }[] = [
  { id: "clear", label: "Clearer-looking skin", productIds: ["anti-pimples-kit", "tea-tree-scrub"] },
  {
    id: "body",
    label: "A soft, glowing body",
    productIds: ["body-lotion", "shower-gel", "caramel-mini-kit"],
  },
  {
    id: "stretch",
    label: "Comfort and care for stretch marks",
    productIds: ["glow-oil-stretch-cream", "body-lotion"],
  },
  {
    id: "full",
    label: "A full ritual, head to toe",
    productIds: ["face-cream", "body-lotion", "caramel-mini-kit"],
  },
];

export const PACE_OPTIONS: { id: PaceId; label: string; intro: string }[] = [
  {
    id: "simple",
    label: "Short and simple",
    intro: "A few pieces, kept simple, for the days you want care without fuss.",
  },
  {
    id: "indulgent",
    label: "Slow and indulgent",
    intro: "A slower routine, for the evenings that belong entirely to you.",
  },
];

/** Step 2 (pace) only changes the ordering and the intro line, never the products. */
export function getRecommendations(focus: FocusId, pace: PaceId) {
  const focusOpt = FOCUS_OPTIONS.find((f) => f.id === focus)!;
  const paceOpt = PACE_OPTIONS.find((p) => p.id === pace)!;
  const ids = pace === "indulgent" ? [...focusOpt.productIds].reverse() : focusOpt.productIds;
  const products = ids.map((id) => getProduct(id)).filter(Boolean) as Product[];
  return { intro: paceOpt.intro, products };
}
