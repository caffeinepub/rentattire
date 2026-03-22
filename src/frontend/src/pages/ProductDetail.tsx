import {
  ChevronDown,
  ChevronUp,
  Heart,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { reviews } from "../data/products";
import { useStore } from "../store/useStore";

interface ProductDetailProps {
  productId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function ProductDetail({
  productId,
  onNavigate,
}: ProductDetailProps) {
  const { adminProducts, addToCart, toggleWishlist, isInWishlist } = useStore();
  const product = adminProducts.find((p) => p.id === productId);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [descOpen, setDescOpen] = useState(true);
  const [added, setAdded] = useState(false);

  if (!product)
    return <div className="p-20 text-center text-black">Product not found</div>;

  const productReviews = reviews.filter((r) => r.productId === productId);
  const inWishlist = isInWishlist(product.id);

  const rentalDays =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;
  const totalRental = rentalDays * product.pricePerDay;
  const today = new Date().toISOString().split("T")[0];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (!startDate || !endDate) {
      alert("Please select rental dates");
      return;
    }
    if (rentalDays < 3 || rentalDays > 10) {
      alert("Rental period must be between 3 and 10 days");
      return;
    }
    addToCart({
      productId: product.id,
      productName: product.name,
      designerName: product.designerName,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      startDate,
      endDate,
      rentalDays,
      pricePerDay: product.pricePerDay,
      depositAmount: product.depositAmount,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => i).map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-amber-400 text-black"
                        : "text-black"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-black">
                ({product.reviewCount} reviews)
              </span>
            </div>

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
              {rentalDays > 0 && (
                <div className="mt-2 pt-2 border-t border-rose-100">
                  <p className="text-sm font-medium text-black">
                    Total Rental ({rentalDays} days):{" "}
                    <span className="text-black font-bold">
                      ₹{totalRental.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-sm text-black">
                    + Deposit ₹{product.depositAmount.toLocaleString()} ={" "}
                    <strong>
                      ₹{(totalRental + product.depositAmount).toLocaleString()}
                    </strong>
                  </p>
                </div>
              )}
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
                        : "border-gray-200 hover:border-rose-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Rental Dates */}
            <div className="mb-5">
              <p className="font-semibold text-black mb-2">
                Rental Period{" "}
                <span className="text-xs font-normal text-black">
                  (3–10 days)
                </span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="rental-start-date"
                    className="text-xs text-black mb-1 block"
                  >
                    Start Date
                  </label>
                  <input
                    id="rental-start-date"
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="rental-end-date"
                    className="text-xs text-black mb-1 block"
                  >
                    Return Date
                  </label>
                  <input
                    id="rental-end-date"
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>
              {rentalDays > 0 && (rentalDays < 3 || rentalDays > 10) && (
                <p className="text-black text-xs mt-1">
                  Rental period must be between 3 and 10 days
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={handleAddToCart}
                data-ocid="product.add_to_cart_button"
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-all ${
                  added
                    ? "bg-green-600 text-black"
                    : "bg-rose-700 text-black hover:bg-rose-800"
                }`}
              >
                <ShoppingCart size={18} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                data-ocid="product.wishlist_toggle"
                className={`p-3 rounded-full border-2 transition-colors ${
                  inWishlist
                    ? "bg-rose-50 border-rose-300 text-black"
                    : "border-gray-200 hover:border-rose-300"
                }`}
              >
                <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
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

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="font-display text-2xl font-bold text-black mb-5">
            Customer Reviews
          </h2>
          {productReviews.length === 0 ? (
            <p className="text-black text-sm">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="space-y-4">
              {productReviews.map((rev) => (
                <div key={rev.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-rose-100 rounded-full flex items-center justify-center text-black font-semibold text-sm">
                      {rev.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-black">
                        {rev.userName}
                      </p>
                      <p className="text-xs text-black">{rev.date}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => i).map((i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < rev.rating
                              ? "fill-amber-400 text-black"
                              : "text-black"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-black">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
