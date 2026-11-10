import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { useSite } from "@/components/providers/SiteProvider";
import { EXHALE } from "@/components/ui/Reveal";
import { BRAND, CONTACT, NAV_LINKS } from "@/data/site";
import { GREETING_MESSAGE, mailtoLink, waLink } from "@/lib/whatsapp";

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValidEmail(email)) return setStatus("error");
        setStatus("done"); // Prototype: simulated, nothing is sent.
      }}
      className="max-w-[420px]"
    >
      <label htmlFor="newsletter" className="t-eyebrow text-ivory/70">
        Quiet letters, now and then
      </label>
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EXHALE }}
            className="mt-4 font-display text-[24px] italic text-ivory"
            role="status"
          >
            Thank you. You're on the list.
          </motion.p>
        ) : (
          <motion.div key="form" exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="relative mt-2">
            <input
              id="newsletter"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-invalid={status === "error"}
              aria-describedby="newsletter-msg"
              className="cx-input-line"
            />
            <button
              type="submit"
              aria-label="Join the list"
              className="absolute bottom-1 right-0 inline-flex h-11 w-11 items-center justify-center text-ivory transition-transform duration-300 hover:translate-x-1"
            >
              <ArrowRight className="h-5 w-5" strokeWidth={1.25} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <p id="newsletter-msg" aria-live="polite" className="mt-3 min-h-5 text-[13px] text-rose">
        {status === "error" ? "Please enter a valid email address." : ""}
      </p>
    </form>
  );
}

export function Footer() {
  const { scrollToId } = useSite();
  const link = "cx-link text-[15px] text-ivory/85 hover:text-ivory min-h-11 inline-flex items-center";
  return (
    <footer
      id="contact"
      data-nav="contact"
      data-theme="dark"
      className="relative overflow-hidden bg-espresso text-ivory"
    >
      <div className="cx-container relative pb-[22vw] pt-10 md:pb-[16vw]">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr] lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-auto" />
              <span className="font-display text-[17px] font-medium uppercase tracking-[0.2em]">{BRAND.name}</span>
            </div>
            <p className="mt-6 max-w-[28ch] font-display text-[24px] italic leading-snug text-ivory/90">
              {BRAND.belief}
            </p>
            <div className="mt-10">
              <Newsletter />
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="t-eyebrow text-ivory/60">Navigate</h2>
            <ul className="mt-5 flex flex-col">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(l.id);
                    }}
                    className={link}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="t-eyebrow text-ivory/60">Skincare</h2>
            <ul className="mt-5 flex flex-col">
              {["Face", "Body", "Kits"].map((c) => (
                <li key={c}>
                  <a
                    href="#skincare"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId("skincare");
                    }}
                    className={link}
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="t-eyebrow text-ivory/60">Contact</h2>
            <ul className="mt-5 flex flex-col">
              <li>
                <a href={waLink(GREETING_MESSAGE)} target="_blank" rel="noopener noreferrer" className={link}>
                  WhatsApp · {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={mailtoLink} className={link}>
                  {CONTACT.email}
                </a>
              </li>
              <li className="inline-flex min-h-11 items-center text-[15px] text-ivory/85">{CONTACT.location}</li>
              <li>
                <a href={CONTACT.channelUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  Follow our WhatsApp Channel
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-gold pt-6 text-[13px] text-ivory/75 md:flex-row md:justify-between">
          <p>© 2026 Cheyness Empire</p>
          <p>{CONTACT.location}</p>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[3.2vw] select-none whitespace-nowrap text-center font-display text-[13.5vw] leading-none tracking-[-0.01em] text-ivory opacity-[0.08]"
      >
        {BRAND.wordmark}
      </p>
    </footer>
  );
}
