import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store/useStore";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cart, wishlist, user, logout } = useStore();

  const navLinks = [
    { label: "CATALOGUE", page: "products" },
    { label: "CATEGORIES", page: "categories" },
    { label: "CONTACT", page: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Nav - Desktop */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {navLinks.slice(0, 2).map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => onNavigate(link.page)}
                data-ocid={`nav.${link.page}_link`}
                className={`text-xs tracking-widest font-sans-body transition-colors ${
                  currentPage === link.page
                    ? "text-foreground border-b border-foreground pb-0.5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Center Brand */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            data-ocid="nav.home_link"
            className="flex-shrink-0 mx-4 md:mx-8"
          >
            <img
              src="/assets/uploads/LOGO-1.jpeg"
              alt="Radhe Radhe Unique Collection"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </button>

          {/* Right Icons */}
          <div className="flex items-center gap-1 md:gap-2 flex-1 justify-end">
            {/* Contact nav on desktop */}
            <button
              type="button"
              onClick={() => onNavigate("contact")}
              data-ocid="nav.contact_link"
              className={`hidden md:block text-xs tracking-widest font-sans-body mr-4 transition-colors ${
                currentPage === "contact"
                  ? "text-foreground border-b border-foreground pb-0.5"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              CONTACT
            </button>

            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center border-b border-foreground">
                  <input
                    className="text-sm outline-none w-32 md:w-48 bg-transparent py-1 font-sans-body"
                    placeholder="Search outfits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onNavigate("products", { search: searchQuery });
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                      if (e.key === "Escape") setSearchOpen(false);
                    }}
                    data-ocid="nav.search_input"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="nav.search_button"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => onNavigate("wishlist")}
              data-ocid="nav.wishlist_link"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={() => onNavigate("cart")}
              data-ocid="nav.cart_link"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User - only show when logged in */}
            {user && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  data-ocid="nav.user_button"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User size={18} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-background border border-border shadow-sm z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted-foreground font-sans-body">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium truncate font-sans-body">
                        {user.name}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate("admin");
                          setUserMenuOpen(false);
                        }}
                        data-ocid="nav.admin_link"
                        className="w-full text-left px-4 py-2 text-sm font-sans-body hover:bg-muted transition-colors"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate("dashboard");
                        setUserMenuOpen(false);
                      }}
                      data-ocid="nav.dashboard_link"
                      className="w-full text-left px-4 py-2 text-sm font-sans-body hover:bg-muted transition-colors"
                    >
                      My Bookings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      data-ocid="nav.logout_button"
                      className="w-full text-left px-4 py-2 text-sm font-sans-body hover:bg-muted transition-colors border-t border-border"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              data-ocid="nav.mobile_menu_button"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMobileOpen(false);
                }}
                data-ocid={`nav.mobile.${link.page}_link`}
                className="block w-full text-left text-xs tracking-widest font-sans-body text-muted-foreground hover:text-foreground py-2 border-b border-border"
              >
                {link.label}
              </button>
            ))}
            {user && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("dashboard");
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left text-xs tracking-widest font-sans-body text-muted-foreground hover:text-foreground py-2 border-b border-border"
                >
                  MY ACCOUNT
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left text-xs tracking-widest font-sans-body text-muted-foreground hover:text-foreground py-2"
                >
                  SIGN OUT
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
