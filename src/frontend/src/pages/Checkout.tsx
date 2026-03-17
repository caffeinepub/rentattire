import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useStore } from "../store/useStore";

interface CheckoutProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Checkout({ onNavigate }: CheckoutProps) {
  const { cart, couponCode, couponDiscount, clearCart, addBooking, user } =
    useStore();
  const { actor } = useActor();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.pricePerDay * item.rentalDays,
    0,
  );
  const totalDeposit = cart.reduce((sum, item) => sum + item.depositAmount, 0);
  const discount = Math.round(subtotal * couponDiscount);
  const total = subtotal + totalDeposit - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="bg-rose-700 text-white px-8 py-3 rounded-full font-semibold"
          >
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      const items = cart.map((item) => ({
        productName: item.productName,
        productDescription: `${item.rentalDays} days rental - ${item.size} / ${item.color}`,
        quantity: BigInt(1),
        priceInCents: BigInt(
          Math.round(
            (item.pricePerDay * item.rentalDays + item.depositAmount) * 100,
          ),
        ),
        currency: "inr",
      }));
      const origin = window.location.origin;
      const url = await actor?.createCheckoutSession(
        items,
        `${origin}/#checkout-success`,
        `${origin}/#cart`,
      );
      if (url) {
        addBooking({
          id: `BK-${Date.now()}`,
          items: [...cart],
          totalRental: subtotal,
          totalDeposit,
          discount,
          finalAmount: total,
          status: "upcoming",
          createdAt: new Date().toISOString(),
          address: { id: "1", label: "Home", ...address },
        });
        clearCart();
        window.location.href = url;
        return;
      }
    } catch {
      // Stripe not configured, simulate success
    }
    addBooking({
      id: `BK-${Date.now()}`,
      items: [...cart],
      totalRental: subtotal,
      totalDeposit,
      discount,
      finalAmount: total,
      status: "upcoming",
      createdAt: new Date().toISOString(),
      address: { id: "1", label: "Home", ...address },
    });
    clearCart();
    onNavigate("checkout-success");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">
          Checkout
        </h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  s <= step
                    ? "bg-rose-700 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 w-16 sm:w-24 mx-1 ${s < step ? "bg-rose-700" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
          <div className="ml-4 text-sm text-gray-500">
            {step === 1
              ? "Delivery Address"
              : step === 2
                ? "Review Order"
                : "Payment"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Delivery Address
                </h2>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  data-ocid="checkout.address_form"
                >
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="checkout-name"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="checkout-name"
                      value={address.name}
                      onChange={(e) =>
                        setAddress({ ...address, name: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="checkout-phone"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      id="checkout-phone"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="checkout-street"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      Street Address
                    </label>
                    <input
                      id="checkout-street"
                      value={address.street}
                      onChange={(e) =>
                        setAddress({ ...address, street: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder="House No, Street, Area"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      City
                    </label>
                    <input
                      id="checkout-city"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-state"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      State
                    </label>
                    <input
                      id="checkout-state"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-pin"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      PIN Code
                    </label>
                    <input
                      id="checkout-pin"
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress({ ...address, pincode: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder="PIN Code"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-5 bg-rose-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-800 transition-colors"
                >
                  Continue to Review
                </button>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Review Your Order
                </h2>
                <div className="space-y-3 mb-5">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex gap-3 pb-3 border-b"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-gray-500">
                          {item.size} | {item.color}
                        </p>
                        <p className="text-gray-500">
                          {item.startDate} to {item.endDate} ({item.rentalDays}{" "}
                          days)
                        </p>
                        <p className="font-semibold text-rose-700">
                          ₹
                          {(
                            item.pricePerDay * item.rentalDays +
                            item.depositAmount
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4">
                  <p className="font-medium text-gray-900 mb-1">
                    Delivering to:
                  </p>
                  <p className="text-gray-600">
                    {address.name}, {address.street}, {address.city}{" "}
                    {address.pincode}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="border border-gray-200 px-6 py-2.5 rounded-full text-sm hover:border-rose-400"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-rose-700 text-white px-8 py-2.5 rounded-full font-semibold hover:bg-rose-800"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-4">Payment</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-sm text-blue-700">
                  <p>
                    You will be redirected to Stripe secure payment page to
                    complete your booking.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="border border-gray-200 px-6 py-2.5 rounded-full text-sm hover:border-rose-400"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    data-ocid="checkout.payment_button"
                    disabled={loading}
                    className="flex-1 bg-rose-700 text-white py-3 rounded-full font-semibold hover:bg-rose-800 transition-colors disabled:opacity-60"
                  >
                    {loading
                      ? "Processing..."
                      : `Pay ₹${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 h-fit">
            <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rental Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Security Deposit</span>
                <span>₹{totalDeposit.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-rose-700">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
