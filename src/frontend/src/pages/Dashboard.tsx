import { Edit, Heart, Home, MapPin, Package, Plus, User } from "lucide-react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useStore } from "../store/useStore";

interface DashboardProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const statusColors: Record<string, string> = {
  upcoming: "bg-blue-100 text-black",
  active: "bg-green-100 text-black",
  returned: "bg-gray-100 text-black",
  cancelled: "bg-red-100 text-black",
};

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "bookings" | "wishlist" | "profile" | "addresses"
  >("bookings");
  const { user, bookings, wishlist, logout } = useStore();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-black mb-4">
            Please sign in to view your dashboard
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="bg-rose-700 text-black px-8 py-3 rounded-full font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      ocid: "dashboard.home_tab",
      navigate: "home",
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: Package,
      ocid: "dashboard.bookings_tab",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: Heart,
      ocid: "dashboard.wishlist_tab",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      ocid: "dashboard.profile_tab",
    },
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
      ocid: "dashboard.addresses_tab",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-black text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-black">
              {user.name}
            </h1>
            <p className="text-black text-sm">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="ml-auto text-sm text-black border border-red-200 px-4 py-2 rounded-full hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => {
                if ("navigate" in tab) {
                  onNavigate(tab.navigate);
                } else {
                  setActiveTab(
                    tab.id as "bookings" | "wishlist" | "profile" | "addresses",
                  );
                }
              }}
              data-ocid={tab.ocid}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-rose-700 text-black"
                  : "bg-white border border-gray-200 text-black hover:border-rose-400"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            {bookings.length === 0 ? (
              <div
                data-ocid="dashboard.bookings.empty_state"
                className="bg-white rounded-2xl p-12 text-center border border-gray-100"
              >
                <div className="text-5xl mb-3">📫</div>
                <h3 className="font-display text-xl font-bold text-black mb-2">
                  No bookings yet
                </h3>
                <p className="text-black mb-4">
                  Start renting designer outfits for your events
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("products")}
                  className="bg-rose-700 text-black px-6 py-2.5 rounded-full text-sm font-semibold"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, idx) => (
                  <div
                    key={booking.id}
                    data-ocid={`dashboard.bookings.item.${idx + 1}`}
                    className="bg-white rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-black">
                          Booking #{booking.id}
                        </p>
                        <p className="text-xs text-black">
                          {new Date(booking.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {booking.items.map((item) => (
                        <div
                          key={`${item.productId}-${item.size}`}
                          className="flex gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-12 h-14 object-cover rounded-lg"
                          />
                          <div className="text-sm">
                            <p className="font-medium text-black">
                              {item.productName}
                            </p>
                            <p className="text-black">
                              {item.size} | {item.startDate} - {item.endDate}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-3 pt-3 flex justify-between text-sm">
                      <span className="text-black">
                        Total:{" "}
                        <strong className="text-black">
                          ₹{booking.finalAmount.toLocaleString()}
                        </strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <div className="text-5xl mb-3">❤️</div>
                <h3 className="font-display text-xl font-bold text-black mb-2">
                  Your wishlist is empty
                </h3>
                <button
                  type="button"
                  onClick={() => onNavigate("products")}
                  className="bg-rose-700 text-black px-6 py-2.5 rounded-full text-sm font-semibold mt-3"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {wishlistProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-black mb-5 flex items-center gap-2">
              <Edit size={16} /> Edit Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="text-sm font-medium text-black block mb-1"
                >
                  Full Name
                </label>
                <input
                  id="profile-name"
                  defaultValue={user.name}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-email"
                  className="text-sm font-medium text-black block mb-1"
                >
                  Email
                </label>
                <input
                  id="profile-email"
                  defaultValue={user.email}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-phone"
                  className="text-sm font-medium text-black block mb-1"
                >
                  Phone
                </label>
                <input
                  id="profile-phone"
                  defaultValue={user.phone}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
            <button
              type="button"
              className="mt-5 bg-rose-700 text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-800"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="space-y-4">
            <button
              type="button"
              className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-2xl p-4 text-black hover:border-rose-400 hover:text-black transition-colors w-full"
            >
              <Plus size={18} /> Add New Address
            </button>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-rose-100 text-black px-2 py-0.5 rounded-full font-medium">
                  Default
                </span>
                <button
                  type="button"
                  className="text-sm text-black hover:text-black"
                >
                  <Edit size={14} />
                </button>
              </div>
              <p className="font-medium text-black">{user.name}</p>
              <p className="text-sm text-black">
                123, Rose Garden Colony, Banjara Hills
              </p>
              <p className="text-sm text-black">
                Hyderabad, Telangana - 500034
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
