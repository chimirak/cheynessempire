import cleanseImg from "@/assets/images/ritual-cleanse.jpg";
import nourishImg from "@/assets/images/ritual-nourish.jpg";
import moisturiseImg from "@/assets/images/ritual-moisturise.jpg";
import glowImg from "@/assets/images/ritual-glow.jpg";

export interface RitualStep {
  number: string;
  word: string;
  line: string;
  image: { src: string; width: number; height: number; alt: string; position: string };
}

export const RITUAL_COPY = { eyebrow: "The self-care ritual" };

export const RITUAL_STEPS: RitualStep[] = [
  {
    number: "01",
    word: "Cleanse",
    line: "Begin by slowing down.",
    image: {
      src: cleanseImg,
      width: 1000,
      height: 1500,
      alt: "Water pouring over cupped hands against a dark background.",
      position: "50% 50%",
    },
  },
  {
    number: "02",
    word: "Nourish",
    line: "Give your skin your full attention.",
    image: {
      src: nourishImg,
      width: 680,
      height: 1072,
      alt: "A white Face Cream jar resting on a clear tub on a marble counter.",
      position: "50% 40%",
    },
  },
  {
    number: "03",
    word: "Moisturise",
    line: "Let the care be gentle.",
    image: {
      src: moisturiseImg,
      width: 1000,
      height: 1500,
      alt: "A woman gently smoothing cream onto her cheek with her fingertips.",
      position: "50% 45%",
    },
  },
  {
    number: "04",
    word: "Glow",
    line: "Notice how you feel.",
    image: {
      src: glowImg,
      width: 1000,
      height: 1136,
      alt: "Warm light falling across a woman's face, her eyes closed.",
      position: "40% 50%",
    },
  },
];
