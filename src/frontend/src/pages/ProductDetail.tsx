import { ChevronDown, ChevronUp, Heart, Shield } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store/useStore";

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function ProductDetail({
  productId,
  onNavigate,
}: ProductDetailProps) {
  const { adminProducts, toggleWishlist, isInWishlist } = useStore();
  const product = adminProducts.find((p) => p.id === productId);
  const [selectedSize, setSelectedSize] = useState("");
  const [descOpen, setDescOpen] = useState(true);

  if (!product)
    return <div className="p-20 text-center text-black">Product not found</div>;

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-black mb-6">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="hover:text-black"
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="hover:text-black"
          >
            Products
          </button>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-gray-50 mb-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-96 lg:h-[520px] object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((img) => (
                <div
                  key={img}
                  className="w-20 h-20 rounded-lg overflow-hidden border-2 border-rose-200 cursor-pointer"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-black font-semibold text-sm mb-1">
              {product.designerName}
            </p>
            <h1 className="font-display text-3xl font-bold text-black mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="bg-rose-50 rounded-xl p-4 mb-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-black">
                  ₹{product.pricePerDay.toLocaleString()}
                </span>
                <span className="text-black">/day</span>
              </div>
              <p className="text-sm text-black">
                Security deposit: ₹{product.depositAmount.toLocaleString()}{" "}
                (refundable)
              </p>
            </div>

            {/* Occasions */}
            <div className="flex flex-wrap gap-2 mb-5">
              {product.occasions.map((occ) => (
                <span
                  key={occ}
                  className="bg-amber-50 text-black text-xs font-medium px-3 py-1 rounded-full border border-amber-200"
                >
                  {occ}
                </span>
              ))}
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <p className="font-semibold text-black mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    data-ocid="product.size_select"
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-rose-700 text-black border-rose-700"
                        : "border-gray-200 text-black hover:border-rose-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Wishlist Button */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                data-ocid="product.wishlist_toggle"
                className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 font-semibold transition-colors ${
                  inWishlist
                    ? "bg-rose-50 border-rose-300 text-black"
                    : "border-gray-200 text-black hover:border-rose-300"
                }`}
              >
                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
                {inWishlist ? "Saved to Wishlist" : "Save to Wishlist"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex justify-center text-center text-xs text-black">
              <div className="flex flex-col items-center gap-1">
                <Shield size={18} className="text-black" />
                <span>Sanitized & Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Accordion */}
        <div className="mt-10 border rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setDescOpen(!descOpen)}
            className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 font-semibold text-black"
          >
            Description
            {descOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {descOpen && (
            <div className="px-6 py-4 text-black text-sm leading-relaxed">
              {product.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
