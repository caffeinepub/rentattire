import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "../data/products";
import { useStore } from "../store/useStore";

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () =>
    onNavigate("product-detail", { id: product.id });

  return (
    <div className="group">
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <button
          type="button"
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={handleCardClick}
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </button>
        {/* Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          data-ocid="product.wishlist_toggle"
          className={`absolute top-3 right-3 p-2 transition-all opacity-0 group-hover:opacity-100 z-10 ${
            inWishlist ? "opacity-100" : ""
          }`}
        >
          <Heart
            size={18}
            className={
              inWishlist
                ? "fill-foreground text-foreground"
                : "fill-background/80 text-background"
            }
          />
        </button>
        {/* View overlay */}
        <button
          type="button"
          onClick={handleCardClick}
          className="absolute inset-x-0 bottom-0 bg-foreground text-background text-center py-3 text-xs tracking-widest font-sans-body opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          VIEW DETAILS
        </button>
      </div>
      {/* Info */}
      <div className="pt-3 pb-1">
        <p className="text-[10px] tracking-widest text-muted-foreground font-sans-body uppercase mb-1">
          {product.designerName}
        </p>
        <h3 className="font-display text-base leading-snug text-foreground line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium font-sans-body text-foreground">
              ₹{product.pricePerDay.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-sans-body">
              /day
            </span>
          </div>
          <button
            type="button"
            onClick={handleCardClick}
            data-ocid="product.add_to_cart_button"
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
