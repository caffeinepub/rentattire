import { categories, products } from "../data/products";

interface CategoriesProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Categories({ onNavigate }: CategoriesProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">
            All Categories
          </h1>
          <p className="text-gray-500">
            Explore our curated collection of designer wear
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.categoryId === cat.id,
            ).length;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => onNavigate("products", { category: cat.id })}
                className={`bg-gradient-to-br ${cat.color} rounded-2xl p-8 text-left hover:shadow-lg transition-all hover:-translate-y-1 group`}
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
                  {cat.name}
                </h2>
                <p className="text-gray-600 text-sm mb-3">{cat.description}</p>
                <p className="text-gray-500 text-xs">
                  {count} outfits available
                </p>
                <div className="mt-4 text-rose-700 font-semibold text-sm group-hover:gap-3 flex items-center gap-2">
                  Browse {cat.name} →
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
