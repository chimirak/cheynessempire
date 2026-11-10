import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";
import { Button } from "@/components/ui/button";
import { ProductImagePanel } from "@/components/ui/ProductCard";
import { EXHALE } from "@/components/ui/Reveal";
import { getProduct, priceLabel, type Product } from "@/data/products";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ritualMessage, waLink } from "@/lib/whatsapp";

/** "My Ritual" saved-items drawer. No checkout, no totals. */
export function RitualDrawer() {
  const { drawerOpen, setDrawerOpen, ritual, removeFromRitual, scrollToId, openProduct } = useSite();
  const reduced = useReducedMotion();
  const items = ritual.map((id) => getProduct(id)).filter(Boolean) as Product[];

  return (
    <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
      <AnimatePresence>
        {drawerOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[110] bg-espresso/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.2 : 0.6, ease: EXHALE }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby="ritual-drawer-desc">
              <motion.div
                initial={reduced ? { opacity: 0 } : { x: "100%" }}
                animate={reduced ? { opacity: 1 } : { x: 0 }}
                exit={reduced ? { opacity: 0 } : { x: "100%" }}
                transition={{ duration: reduced ? 0.2 : 0.6, ease: EXHALE }}
                data-lenis-prevent
                className="fixed right-0 top-0 z-[111] flex h-full w-full max-w-[460px] flex-col bg-ivory text-espresso outline-none"
              >
                <div className="flex items-center justify-between border-b border-gold/60 px-6 py-5 md:px-8">
                  <Dialog.Title className="font-display text-[30px] leading-none">
                    My <em className="italic">Ritual</em>
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close My Ritual"
                      className="-mr-2 inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-rose"
                    >
                      <X className="h-5 w-5" strokeWidth={1.25} />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description id="ritual-drawer-desc" className="sr-only">
                  The pieces you have saved. Send them to us on WhatsApp to ask about them.
                </Dialog.Description>

                <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-start justify-center gap-6">
                      <p className="font-display text-[28px] leading-tight">
                        Your ritual is still a quiet page.
                      </p>
                      <p className="t-body text-espresso/75">
                        Save the pieces that speak to you and we'll talk them through with you.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDrawerOpen(false);
                          setTimeout(() => scrollToId("skincare"), 350);
                        }}
                      >
                        Explore the edit
                      </Button>
                    </div>
                  ) : (
                    <ul className="flex flex-col divide-y divide-espresso/10" aria-live="polite">
                      <AnimatePresence initial={false}>
                        {items.map((p) => (
                          <motion.li
                            key={p.id}
                            layout={!reduced}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-4 py-4"
                          >
                            <button
                              type="button"
                              className="w-16 shrink-0"
                              onClick={() => {
                                setDrawerOpen(false);
                                openProduct(p.id);
                              }}
                              aria-label={`View ${p.name}`}
                            >
                              <ProductImagePanel product={p} compact hoverZoom={false} className="aspect-[4/5] w-16" />
                            </button>
                            <div className="min-w-0 flex-1">
                              <p className="font-display text-[22px] leading-tight">{p.name}</p>
                              <p className="text-[14px] text-espresso/75">{priceLabel(p)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromRitual(p.id)}
                              className="cx-link min-h-11 text-[13px] text-espresso/75 hover:text-espresso"
                              aria-label={`Remove ${p.name} from My Ritual`}
                            >
                              Remove
                            </button>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-gold/60 px-6 py-6 md:px-8">
                    <Button variant="espresso" asChild className="w-full">
                      <a
                        href={waLink(ritualMessage(items.map((p) => p.name)))}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Send my ritual to WhatsApp
                      </a>
                    </Button>
                    <p className="mt-4 text-center text-[13px] text-espresso/70">
                      This prototype doesn't process payments or orders.
                    </p>
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
