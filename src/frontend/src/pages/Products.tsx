import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useStore } from "../store/useStore";

interface ProductsProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  initialSearch?: string;
}

const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const allOccasions = [
  "Wedding",
  "Party",
  "Formal",
  "Festival",
  "Engagement",
  "Sangeet",
  "Corporate",
];

export default function Products({ onNavigate, initialSearch }: ProductsProps) {
  const { adminProducts } = useStore();
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const toggle = (
    arr: string[],
    setArr: (v: string[]) => void,
    val: string,
  ) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const filtered = useMemo(() => {
    let result = [...adminProducts];
    if (search)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.designerName.toLowerCase().includes(search.toLowerCase()),
      );
    if (selectedSizes.length)
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s)),
      );
    if (selectedOccasions.length)
      result = result.filter((p) =>
        p.occasions.some((o) => selectedOccasions.includes(o)),
      );
    result = result.filter(
      (p) => p.pricePerDay >= priceRange[0] && p.pricePerDay <= priceRange[1],
    );
    if (sortBy === "price-asc")
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sortBy === "price-desc")
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [
    adminProducts,
    search,
    selectedSizes,
    selectedOccasions,
    priceRange,
    sortBy,
  ]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-2 font-sans-body">
            RENTATTIRE
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-1">
            Collection
          </h1>
          <p className="text-sm text-muted-foreground font-sans-body">
            {filtered.length} pieces available
          </p>
        </div>
      </div>
      {/* Toolbar */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-sm border-b border-foreground/30 focus-within:border-foreground transition-colors">
            <Search size={14} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search designers, styles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              data-ocid="products.search_input"
              className="flex-1 py-2 text-sm bg-transparent outline-none font-sans-body placeholder:text-muted-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              data-ocid="products.sort.select"
              className="text-xs tracking-wider font-sans-body bg-transparent border-0 outline-none text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <option value="featured">FEATURED</option>
              <option value="price-asc">PRICE: LOW–HIGH</option>
              <option value="price-desc">PRICE: HIGH–LOW</option>
              <option value="rating">TOP RATED</option>
            </select>

            {/* Filter toggle */}
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              data-ocid="products.filter.toggle"
              className="flex items-center gap-2 text-xs tracking-wider font-sans-body text-muted-foreground hover:text-foreground transition-colors"
            >
              <SlidersHorizontal size={14} />
              FILTER
              {(selectedSizes.length > 0 || selectedOccasions.length > 0) && (
                <span className="bg-foreground text-background text-[10px] w-4 h-4 flex items-center justify-center">
                  {selectedSizes.length + selectedOccasions.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="border-b border-border bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sizes */}
            <div>
              <p className="text-[10px] tracking-widest text-muted-foreground mb-3 font-sans-body">
                SIZE
              </p>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      toggle(selectedSizes, setSelectedSizes, size)
                    }
                    className={`px-3 py-1 text-xs font-sans-body border transition-colors ${
                      selectedSizes.includes(size)
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div>
              <p className="text-[10px] tracking-widest text-muted-foreground mb-3 font-sans-body">
                OCCASION
              </p>
              <div className="flex flex-wrap gap-2">
                {allOccasions.map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() =>
                      toggle(selectedOccasions, setSelectedOccasions, occ)
                    }
                    className={`px-3 py-1 text-xs font-sans-body border transition-colors ${
                      selectedOccasions.includes(occ)
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-[10px] tracking-widest text-muted-foreground mb-3 font-sans-body">
                PRICE / DAY
              </p>
              <p className="text-sm font-sans-body mb-2 text-foreground">
                Up to ₹{priceRange[1].toLocaleString()}
              </p>
              <input
                type="range"
                min={0}
                max={3000}
                step={100}
                value={priceRange[1]}
                onChange={(e) => {
                  setPriceRange([0, Number(e.target.value)]);
                  setPage(1);
                }}
                className="w-full accent-foreground"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedSizes([]);
                  setSelectedOccasions([]);
                  setPriceRange([0, 3000]);
                }}
                className="mt-4 text-xs tracking-wider font-sans-body text-muted-foreground hover:text-foreground border-b border-muted-foreground hover:border-foreground transition-colors"
              >
                CLEAR ALL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {paginated.length === 0 ? (
          <div data-ocid="products.empty_state" className="text-center py-24">
            <p className="font-display text-2xl mb-3 text-muted-foreground">
              No pieces found
            </p>
            <p className="text-sm text-muted-foreground font-sans-body mb-6">
              Try adjusting your filters or search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedSizes([]);
                setSelectedOccasions([]);
                setPriceRange([0, 3000]);
              }}
              className="border border-foreground text-foreground px-6 py-2 text-xs tracking-widest font-sans-body hover:bg-foreground hover:text-background transition-colors"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigate={onNavigate}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  data-ocid="products.pagination_prev"
                  className="px-4 py-2 text-xs tracking-wider font-sans-body border border-border hover:border-foreground disabled:opacity-30 transition-colors"
                >
                  PREV
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs font-sans-body border transition-colors ${
                        page === p
                          ? "bg-foreground text-background border-foreground"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  data-ocid="products.pagination_next"
                  className="px-4 py-2 text-xs tracking-wider font-sans-body border border-border hover:border-foreground disabled:opacity-30 transition-colors"
                >
                  NEXT
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
