import { Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store/useStore";

interface CartProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Cart({ onNavigate }: CartProps) {
  const {
    cart,
    removeFromCart,
    couponCode,
    couponDiscount,
    applyCoupon,
    clearCoupon,
  } = useStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.pricePerDay * item.rentalDays,
    0,
  );
  const totalDeposit = cart.reduce((sum, item) => sum + item.depositAmount, 0);
  const discount = Math.round(subtotal * couponDiscount);
  const total = subtotal + totalDeposit - discount;

  const handleCoupon = () => {
    const ok = applyCoupon(couponInput);
    setCouponMsg(ok ? "✓ Coupon applied!" : "✗ Invalid coupon code");
    setTimeout(() => setCouponMsg(""), 3000);
  };

  if (cart.length === 0) {
    return (
      <div
        data-ocid="cart.empty_state"
        className="min-h-screen flex flex-col items-center justify-center bg-background"
      >
        <div className="text-center">
          <p className="font-display text-3xl mb-3 text-muted-foreground">
            Your cart is empty
          </p>
          <p className="text-sm text-muted-foreground font-sans-body mb-8">
            Add some designer outfits to get started.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="border border-foreground text-foreground px-10 py-3 text-xs tracking-widest font-sans-body hover:bg-foreground hover:text-background transition-colors"
          >
            BROWSE COLLECTION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-border pb-6 mb-8">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-1 font-sans-body">
            YOUR ORDER
          </p>
          <h1 className="font-display text-3xl">Shopping Cart</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, idx) => (
              <div
                key={`${item.productId}-${item.size}`}
                data-ocid={`cart.item.${idx + 1}`}
                className="flex gap-5 border-b border-border pb-6"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-28 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-widest text-muted-foreground font-sans-body mb-1">
                    {item.designerName.toUpperCase()}
                  </p>
                  <h3 className="font-display text-base mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-sans-body mb-2">
                    {item.size} · {item.color}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans-body">
                    {item.startDate} → {item.endDate} ({item.rentalDays} days)
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium font-sans-body mb-3">
                    ₹{(item.pricePerDay * item.rentalDays).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans-body mb-3">
                    +₹{item.depositAmount.toLocaleString()} deposit
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.size)}
                    data-ocid={`cart.delete_button.${idx + 1}`}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="border border-border p-6">
              <p className="text-[10px] tracking-widest text-muted-foreground font-sans-body mb-6">
                ORDER SUMMARY
              </p>

              {/* Coupon */}
              <div className="border-b border-border pb-5 mb-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    data-ocid="cart.coupon_input"
                    className="flex-1 border-b border-border bg-transparent text-sm py-2 font-sans-body outline-none focus:border-foreground transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleCoupon}
                    data-ocid="cart.apply_coupon_button"
                    className="text-xs tracking-wider font-sans-body text-foreground border border-foreground px-3 py-1 hover:bg-foreground hover:text-background transition-colors"
                  >
                    APPLY
                  </button>
                </div>
                {couponMsg && (
                  <p
                    className={`text-xs font-sans-body mt-2 ${couponMsg.startsWith("✓") ? "text-green-700" : "text-destructive"}`}
                  >
                    {couponMsg}
                  </p>
                )}
                {couponCode && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-foreground font-sans-body">
                      {couponCode} applied
                    </span>
                    <button
                      type="button"
                      onClick={clearCoupon}
                      className="text-xs text-muted-foreground hover:text-foreground font-sans-body"
                    >
                      <Tag size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm font-sans-body">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rental Total</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Security Deposit
                  </span>
                  <span>₹{totalDeposit.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("checkout")}
                data-ocid="cart.checkout_button"
                className="w-full mt-6 bg-foreground text-background py-4 text-xs tracking-widest font-sans-body hover:bg-foreground/90 transition-colors"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
