import { CheckCircle } from "lucide-react";

interface CheckoutSuccessProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function CheckoutSuccess({ onNavigate }: CheckoutSuccessProps) {
  const orderId = `BK-${Math.floor(Math.random() * 900000 + 100000)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 mb-4">
          Your order has been placed successfully.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500">Booking ID</p>
          <p className="font-bold text-gray-900 text-lg">{orderId}</p>
        </div>
        <div className="space-y-3 text-sm text-gray-600 text-left mb-6">
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">1.</span>
            <span>You will receive a confirmation email shortly.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">2.</span>
            <span>
              Your outfit will be delivered 1 day before your rental start date.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">3.</span>
            <span>Our team will schedule a free pickup after your event.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">4.</span>
            <span>
              Security deposit will be refunded within 5-7 business days after
              return.
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="flex-1 border border-rose-700 text-rose-700 py-2.5 rounded-full font-semibold hover:bg-rose-50"
          >
            View Bookings
          </button>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex-1 bg-rose-700 text-white py-2.5 rounded-full font-semibold hover:bg-rose-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
