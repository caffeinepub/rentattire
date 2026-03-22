import ProductCard from "../components/ProductCard";
import { products } from "../data/products";
import { useStore } from "../store/useStore";

interface WishlistProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Wishlist({ onNavigate }: WishlistProps) {
  const { wishlist } = useStore();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-black mb-2">
          My Wishlist
        </h1>
        <p className="text-black mb-8">{wishlistProducts.length} saved items</p>

        {wishlistProducts.length === 0 ? (
          <div data-ocid="wishlist.empty_state" className="text-center py-20">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="font-display text-2xl font-bold text-black mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-black mb-6">Save outfits you love for later</p>
            <button
              type="button"
              onClick={() => onNavigate("products")}
              className="bg-rose-700 text-black px-8 py-3 rounded-full font-semibold hover:bg-rose-800 transition-colors"
            >
              Browse Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
