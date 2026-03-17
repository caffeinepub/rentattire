import { ArrowRight } from "lucide-react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";

interface HomeProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const allCategories = [{ id: "", name: "All" }, ...categories];

export default function Home({ onNavigate }: HomeProps) {
  const [email, setEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const featured = products.slice(0, 8);
  const filtered = activeCategory
    ? featured.filter((p) => p.categoryId === activeCategory)
    : featured;

  return (
    <div className="bg-background">
      {/* ── Hero ── */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
          {/* Left image */}
          <div className="relative overflow-hidden">
            <img
              src="/assets/generated/hero-editorial-left.dim_700x900.jpg"
              alt="Designer Fashion"
              className="w-full h-full object-cover min-h-[50vw] md:min-h-full"
            />
          </div>
          {/* Right image + text */}
          <div className="relative overflow-hidden bg-muted">
            <img
              src="/assets/generated/hero-editorial-right.dim_700x900.jpg"
              alt="Designer Bridal"
              className="w-full h-full object-cover min-h-[50vw] md:min-h-full"
            />
            <div className="absolute inset-0 bg-foreground/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <div>
                <p className="text-background/70 text-[10px] tracking-[0.3em] mb-3 font-sans-body">
                  PREMIUM FASHION RENTALS
                </p>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-background leading-[1.1] mb-5">
                  Rent Designer
                  <br />
                  Attire
                </h1>
                <p className="text-background/80 text-sm mb-6 font-sans-body max-w-xs leading-relaxed">
                  Look extraordinary at weddings, parties &amp; events.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate("products")}
                  data-ocid="home.hero_cta_button"
                  className="inline-flex items-center gap-2 border border-background text-background px-6 py-3 text-xs tracking-widest font-sans-body hover:bg-background hover:text-foreground transition-colors"
                >
                  BROWSE COLLECTION <ArrowRight size={14} />
                </button>
              </div>
              {/* Promo badge */}
              <div className="absolute top-6 right-6 bg-background text-foreground text-center px-3 py-2">
                <p className="text-[10px] tracking-widest font-sans-body">
                  FIRST ORDER
                </p>
                <p className="font-display text-xl">10% OFF</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filter Pills ── */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-5 scrollbar-hide">
            <span className="text-[10px] tracking-widest text-muted-foreground font-sans-body whitespace-nowrap mr-4">
              CATALOGUE
            </span>
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                data-ocid="home.category.tab"
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-1.5 text-xs tracking-wider font-sans-body border transition-colors flex-shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-border hover:border-foreground"
                }`}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => onNavigate("products")}
            data-ocid="home.view_all_button"
            className="border border-foreground text-foreground px-10 py-3 text-xs tracking-widest font-sans-body hover:bg-foreground hover:text-background transition-colors"
          >
            VIEW ALL PIECES
          </button>
        </div>
      </section>

      {/* ── Brand Story ── */}
      <section className="border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden h-[400px] md:h-auto">
            <img
              src="/assets/generated/brand-story.dim_1200x700.jpg"
              alt="RentAttire Story"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-16 bg-muted">
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-4 font-sans-body">
              OUR STORY
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-[1.1]">
              Fashion
              <br />
              Without
              <br />
              Compromise
            </h2>
            <p className="text-sm text-muted-foreground font-sans-body leading-relaxed mb-8">
              RentAttire was born from a simple belief: every person deserves to
              wear extraordinary designer fashion — not just those who can
              afford to buy it. We partner with India&apos;s finest designers to
              bring you couture and contemporary fashion at a fraction of the
              cost.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              data-ocid="home.story_cta_button"
              className="self-start border border-foreground text-foreground px-8 py-3 text-xs tracking-widest font-sans-body hover:bg-foreground hover:text-background transition-colors"
            >
              LEARN MORE
            </button>
          </div>
        </div>
      </section>

      {/* ── How We Work ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground mb-3 font-sans-body">
            THE PROCESS
          </p>
          <h2 className="font-display text-3xl md:text-4xl">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              num: "01",
              title: "Browse",
              desc: "Explore thousands of designer outfits curated for every occasion.",
            },
            {
              num: "02",
              title: "Select Dates",
              desc: "Choose your rental period from 3 to 10 days.",
            },
            {
              num: "03",
              title: "Book & Pay",
              desc: "Secure checkout with instant booking confirmation.",
            },
            {
              num: "04",
              title: "Wear & Return",
              desc: "We deliver to your door. Free pickup after your event.",
            },
          ].map((step) => (
            <div key={step.num} className="border-t-2 border-border pt-6">
              <p className="font-display text-4xl text-muted-foreground/40 mb-3">
                {step.num}
              </p>
              <h3 className="font-display text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-sans-body leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="bg-foreground text-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-[10px] tracking-[0.3em] text-background/60 mb-4 font-sans-body">
            STAY INSPIRED
          </p>
          <h2 className="font-display text-3xl md:text-4xl mb-3">
            New Arrivals &amp; Offers
          </h2>
          <p className="text-sm text-background/60 mb-8 font-sans-body">
            Join thousands of fashion-forward renters. Get 10% off your first
            booking.
          </p>
          <div className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-ocid="home.newsletter.input"
              className="flex-1 bg-background/10 border border-background/30 text-background placeholder:text-background/40 px-4 py-3 text-sm outline-none focus:border-background/60 transition-colors font-sans-body"
            />
            <button
              type="button"
              data-ocid="home.newsletter.submit_button"
              className="bg-background text-foreground px-8 py-3 text-xs tracking-widest font-sans-body hover:bg-background/90 transition-colors"
            >
              JOIN
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
