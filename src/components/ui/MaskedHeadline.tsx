import { motion } from "framer-motion";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EXHALE } from "./Reveal";

type Tag = "h1" | "h2" | "h3" | "p";

interface MaskedHeadlineProps {
  /** Use *word* for the single italic emphasis and " / " for a line break. */
  text: string;
  as?: Tag;
  className?: string;
  emClassName?: string;
  /** "md" = line breaks only from tablet up (mobile wraps naturally). */
  breaks?: "always" | "md";
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
}

interface Word {
  text: string;
  em: boolean;
}

export function parseHeadline(text: string): Word[][] {
  return text.split(" / ").map((line) => {
    const words: Word[] = [];
    line.split(/(\*[^*]+\*)/).forEach((chunk) => {
      if (!chunk) return;
      const em = chunk.startsWith("*") && chunk.endsWith("*");
      const clean = em ? chunk.slice(1, -1) : chunk;
      clean
        .split(" ")
        .filter(Boolean)
        .forEach((w) => words.push({ text: w, em }));
    });
    return words;
  });
}

export const plainHeadline = (text: string) => text.replace(/\*/g, "").replace(/ \/ /g, " ");

/** Headline that rises word by word out of a mask. */
export function MaskedHeadline({
  text,
  as = "h2",
  className,
  emClassName,
  breaks = "md",
  play,
  delay = 0,
  stagger = 0.07,
  duration = 1.1,
}: MaskedHeadlineProps) {
  const reduced = useReducedMotion();
  const Comp = motion[as];
  const lines = parseHeadline(text);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : delay } },
  };
  const word = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : { hidden: { y: "110%" }, show: { y: "0%", transition: { duration, ease: EXHALE } } };

  const trigger =
    play === undefined
      ? { whileInView: "show", viewport: { once: true, margin: "-10% 0px -10% 0px" } }
      : { animate: play ? "show" : "hidden" };

  return (
    <Comp className={className} initial="hidden" variants={container} {...trigger}>
      <span className="sr-only">{plainHeadline(text)}</span>
      <span aria-hidden>
        {lines.map((line, li) => (
          <span key={li} className={breaks === "always" ? "block" : "md:block"}>
            {line.map((w, wi) => (
              <Fragment key={wi}>
                <span className="cx-mask">
                  <motion.span
                    variants={word}
                    className={cn("inline-block will-change-transform", w.em && cn("italic", emClassName))}
                  >
                    {w.text}
                  </motion.span>
                </span>
                {wi < line.length - 1 || breaks === "md" ? " " : null}
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </Comp>
  );
}
