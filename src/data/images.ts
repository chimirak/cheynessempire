import waterHands from "@/assets/images/water-hands.jpg";
import linenBowl from "@/assets/images/linen-bowl.jpg";
import leavesLight from "@/assets/images/leaves-light.jpg";
import shoulderCare from "@/assets/images/shoulder-care.jpg";
import detailLinenJar from "@/assets/images/detail-linen-jar.jpg";

// Royalty-free lifestyle photography (Unsplash), warm and quiet in grade.
export const LIFESTYLE = {
  waterHands: {
    src: waterHands,
    width: 900,
    height: 1350,
    alt: "Clear water falling into open hands.",
    position: "50% 55%",
  },
  linenBowl: {
    src: linenBowl,
    width: 1100,
    height: 728,
    alt: "A small ceramic bowl resting on a folded linen towel.",
    position: "38% 50%",
  },
  leavesLight: {
    src: leavesLight,
    width: 900,
    height: 1350,
    alt: "Soft shadows of leaves falling across a warm plaster wall.",
    position: "50% 50%",
  },
  shoulderCare: {
    src: shoulderCare,
    width: 900,
    height: 1125,
    alt: "A woman with her eyes closed, one hand resting softly on her shoulder.",
    position: "50% 40%",
  },
  detailLinenJar: {
    src: detailLinenJar,
    width: 600,
    height: 400,
    alt: "An open jar of cream on a folded white towel.",
    position: "50% 50%",
  },
} as const;
