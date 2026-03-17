import { Instagram, Mail, Twitter, Youtube } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl md:text-3xl mb-1">
                Stay in the loop
              </h3>
              <p className="text-background/60 text-sm font-sans-body">
                New arrivals, exclusive offers & style edits.
              </p>
            </div>
            <div className="flex gap-0 max-w-sm w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                data-ocid="footer.newsletter.input"
                className="flex-1 bg-background/10 border border-background/20 px-4 py-3 text-sm text-background placeholder:text-background/40 outline-none focus:border-background/50 transition-colors font-sans-body"
              />
              <button
                type="button"
                data-ocid="footer.newsletter.submit_button"
                className="bg-background text-foreground px-6 py-3 text-xs tracking-widest font-sans-body hover:bg-background/90 transition-colors"
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-display text-3xl mb-4">RentAttire</p>
            <p className="text-sm text-background/60 mb-6 font-sans-body leading-relaxed">
              Premium designer fashion rentals for every occasion. Look
              extraordinary.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="p-2 border border-background/20 hover:border-background/60 transition-colors"
              >
                <Instagram size={16} />
              </button>
              <button
                type="button"
                className="p-2 border border-background/20 hover:border-background/60 transition-colors"
              >
                <Twitter size={16} />
              </button>
              <button
                type="button"
                className="p-2 border border-background/20 hover:border-background/60 transition-colors"
              >
                <Youtube size={16} />
              </button>
              <button
                type="button"
                className="p-2 border border-background/20 hover:border-background/60 transition-colors"
              >
                <Mail size={16} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs tracking-widest mb-5 text-background/60 font-sans-body">
              NAVIGATE
            </p>
            <ul className="space-y-3">
              {[
                { label: "Home", page: "home" },
                { label: "Catalogue", page: "products" },
                { label: "Categories", page: "categories" },
                { label: "Contact", page: "contact" },
              ].map((item) => (
                <li key={item.page}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.page)}
                    className="text-sm text-background/70 hover:text-background transition-colors font-sans-body"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs tracking-widest mb-5 text-background/60 font-sans-body">
              COLLECTIONS
            </p>
            <ul className="space-y-3">
              {[
                "Lehenga",
                "Gowns",
                "Sherwani",
                "Tuxedos",
                "Suits",
                "Sarees",
              ].map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onNavigate("products")}
                    className="text-sm text-background/70 hover:text-background transition-colors font-sans-body"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-xs tracking-widest mb-5 text-background/60 font-sans-body">
              SUPPORT
            </p>
            <ul className="space-y-3">
              {[
                "FAQ",
                "Rental Terms",
                "Sizing Guide",
                "Delivery & Returns",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-background/70 font-sans-body">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-background/50 font-sans-body">
            © {year} RentAttire. All rights reserved.
          </p>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-background/40 hover:text-background/60 transition-colors font-sans-body"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
