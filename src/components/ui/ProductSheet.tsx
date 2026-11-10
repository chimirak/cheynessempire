import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useRef } from "react";
import { useSite } from "@/components/providers/SiteProvider";
import { Button } from "@/components/ui/button";
import { ArchImage } from "@/components/ui/ArchImage";
import { PhotoComingSoon } from "@/components/ui/ProductCard";
import { EXHALE } from "@/components/ui/Reveal";
import { PRODUCTS, getProduct, priceLabel, type Product } from "@/data/products";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { productMessage, waLink } from "@/lib/whatsapp";

/** Product detail: right-hand panel on desktop, bottom sheet on mobile. */
export function ProductSheet() {
  const { activeProductId, closeProduct } = useSite();
  const desktop = useMediaQuery("(min-width: 768px)");
  const reduced = useReducedMotion();
  const product = activeProductId ? getProduct(activeProductId) : undefined;
  const lastProduct = useRef<Product | undefined>(undefined);
  if (product) lastProduct.current = product;
  const shown = product ?? lastProduct.current;
  const open = Boolean(product);
  const dragControls = useDragControls();

  const panelMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
    : desktop
      ? {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
          transition: { duration: 0.6, ease: EXHALE },
        }
      : {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
          transition: { duration: 0.6, ease: EXHALE },
        };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && closeProduct()}>
      <AnimatePresence>
        {open && shown && (
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
            <Dialog.Content asChild forceMount aria-describedby="product-sheet-desc">
              <motion.div
                {...panelMotion}
                drag={!desktop && !reduced ? "y" : false}
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.7 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 120 || info.velocity.y > 600) closeProduct();
                }}
                data-lenis-prevent
                className={
                  desktop
                    ? "fixed right-0 top-0 z-[111] flex h-full w-[52vw] min-w-[560px] max-w-[900px] flex-col overflow-y-auto bg-ivory text-espresso outline-none"
                    : "fixed inset-x-0 bottom-0 z-[111] flex h-[92svh] flex-col overflow-y-auto bg-ivory text-espresso outline-none"
                }
              >
                {!desktop && (
                  <div
                    className="sticky top-0 z-10 flex cursor-grab touch-none justify-center bg-ivory pb-2 pt-3"
                    onPointerDown={(e) => dragControls.start(e)}
                    aria-hidden
                  >
                    <span className="block h-[3px] w-12 bg-espresso/25" />
                  </div>
                )}
                <SheetBody product={shown} desktop={desktop} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function SheetBody({ product, desktop }: { product: Product; desktop: boolean }) {
  const { openProduct, addToRitual, inRitual, setDrawerOpen, closeProduct } = useSite();
  const reduced = useReducedMotion();
  const index = PRODUCTS.findIndex((p) => p.id === product.id);
  const prev = PRODUCTS[(index - 1 + PRODUCTS.length) % PRODUCTS.length]!;
  const next = PRODUCTS[(index + 1) % PRODUCTS.length]!;
  const added = inRitual(product.id);

  const item = (i: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: reduced
      ? { duration: 0.2 }
      : { duration: 0.8, delay: 0.35 + i * 0.08, ease: EXHALE },
  });

  return (
    <div className={desktop ? "px-14 pb-16 pt-10" : "px-5 pb-12 pt-2"}>
      <div className="flex items-center justify-between">
        <p className="t-eyebrow text-sage">{product.category}</p>
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close product details"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-espresso transition-colors hover:text-rose"
          >
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </Dialog.Close>
      </div>

      <div className={desktop ? "mt-6 grid grid-cols-[1fr] gap-10" : "mt-4"}>
        <div className="relative mx-auto w-full max-w-[380px]">
          {product.image ? (
            <ArchImage
              key={product.id}
              src={product.image.src}
              alt={product.image.alt}
              width={product.image.width}
              height={product.image.height}
              position={product.image.position}
              revealPlay
              revealDelay={0.15}
              className={
                (product.tint === "rose" ? "bg-rose/20 " : "") +
                "aspect-[3/4] w-full"
              }
            />
          ) : (
            <div key={product.id} className="cx-arch aspect-[3/4] w-full">
              <PhotoComingSoon />
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => openProduct(prev.id)}
              className="inline-flex min-h-11 items-center gap-2 text-[13px] text-espresso/75 transition-colors hover:text-espresso"
              aria-label={`Previous product: ${prev.name}`}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.25} /> Previous
            </button>
            <span className="t-eyebrow text-espresso/60">
              {String(index + 1).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => openProduct(next.id)}
              className="inline-flex min-h-11 items-center gap-2 text-[13px] text-espresso/75 transition-colors hover:text-espresso"
              aria-label={`Next product: ${next.name}`}
            >
              Next <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
            </button>
          </div>
        </div>

        <div key={product.id + "-text"} className={desktop ? "" : "mt-8"}>
          <motion.div {...item(0)}>
            <Dialog.Title className="font-display text-[40px] leading-[1.02] text-espresso md:text-[48px]">
              {product.name}
            </Dialog.Title>
          </motion.div>
          <motion.div {...item(1)}>
            <Dialog.Description id="product-sheet-desc" className="t-body mt-4 text-espresso/80">
              {product.description}
            </Dialog.Description>
          </motion.div>
          <motion.p {...item(2)} className="mt-5 font-display text-[26px] text-espresso">
            {priceLabel(product)}
          </motion.p>
          <motion.div {...item(3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="espresso"
              onClick={() => {
                if (added) {
                  closeProduct();
                  setDrawerOpen(true);
                } else addToRitual(product.id);
              }}
              aria-live="polite"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={1.5} /> In your ritual · View
                </>
              ) : (
                "Add to My Ritual"
              )}
            </Button>
            <Button variant="outline" asChild>
              <a href={waLink(productMessage(product.name))} target="_blank" rel="noopener noreferrer">
                Ask on WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
