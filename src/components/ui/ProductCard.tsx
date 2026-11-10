import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/LogoMark";
import { priceLabel, type Product } from "@/data/products";

/** Typographic tile used where no product photography exists yet. */
export function PhotoComingSoon({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-ivory-deep text-espresso">
      <LogoMark className={cn("text-espresso/80", compact ? "h-10" : "h-20")} />
      <p className="t-eyebrow text-espresso/60">Photography coming soon</p>
    </div>
  );
}

export function ProductImagePanel({
  product,
  className,
  hoverZoom = true,
  compact = false,
}: {
  product: Product;
  className?: string;
  hoverZoom?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        product.tint === "rose" ? "bg-rose/20" : "bg-ivory-deep",
        className,
      )}
    >
      {product.image ? (
        <img
          src={product.image.src}
          alt={product.image.alt}
          width={product.image.width}
          height={product.image.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ objectPosition: product.image.position }}
          className={cn(
            "h-full w-full select-none object-cover",
            hoverZoom &&
              "transition-transform duration-700 ease-exhale group-hover:scale-105 motion-reduce:group-hover:scale-100",
          )}
        />
      ) : (
        <PhotoComingSoon compact={compact} />
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onOpen: (id: string) => void;
  variant?: "edit" | "mini";
  className?: string;
}

export function ProductCard({ product, onOpen, variant = "edit", className }: ProductCardProps) {
  const mini = variant === "mini";
  return (
    <button
      type="button"
      onClick={() => onOpen(product.id)}
      data-cursor="View"
      aria-label={`${product.name}, ${priceLabel(product)}. View details`}
      className={cn("group block w-full text-left", className)}
    >
      <ProductImagePanel product={product} compact={mini} className="aspect-[4/5] w-full" />
      <div className={cn(mini ? "pt-4" : "pt-6")}>
        <h3 className={cn("font-display text-espresso", mini ? "text-[24px] leading-tight" : "t-product")}>
          {product.name}
        </h3>
        {!mini && (
          <p className="mt-2 max-w-[38ch] text-[15px] font-light leading-relaxed text-espresso/70">
            {product.description}
          </p>
        )}
        <p className={cn("text-[15px] text-espresso", mini ? "mt-1" : "mt-3")}>{priceLabel(product)}</p>
        <span className="t-btn mt-4 inline-flex items-center gap-2 text-espresso">
          Explore
          <span className="inline-flex items-center">
            <span className="block h-px w-0 bg-espresso transition-all duration-300 ease-exhale group-hover:w-5" />
            <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
          </span>
        </span>
      </div>
    </button>
  );
}
