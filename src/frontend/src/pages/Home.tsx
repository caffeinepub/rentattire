import {
  ChevronDown,
  Heart,
  Menu,
  Music,
  ShoppingCart,
  User,
  VolumeX,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import MoonCanvas from "../components/MoonCanvas";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";
import { useStore } from "../store/useStore";

interface HomeProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const allCategories = [{ id: "", name: "All" }, ...categories];

// Tree silhouette SVG paths
const LEFT_TREE =
  "M0,900 L0,400 C20,380 10,340 30,300 C15,310 5,280 25,240 C10,250 15,210 35,180 C20,195 30,150 50,120 C40,140 60,100 55,70 C70,90 75,55 70,30 L75,30 C70,55 80,90 90,70 C90,100 105,140 100,120 C115,150 120,195 110,180 C125,210 130,250 115,240 C130,280 125,310 110,300 C125,340 115,380 140,400 L140,900 Z";
const RIGHT_TREE =
  "M860,900 L860,400 C840,380 850,340 830,300 C845,310 855,280 835,240 C850,250 845,210 825,180 C840,195 830,150 810,120 C820,140 800,100 805,70 C790,90 785,55 790,30 L785,30 C790,55 780,90 770,70 C770,100 755,140 760,120 C745,150 740,195 750,180 C735,210 730,250 745,240 C730,280 735,310 750,300 C735,340 745,380 720,400 L720,900 Z";

const GALLERY_ITEMS = [
  { label: "Divine Collection I", sub: "Sacred Bridal" },
  { label: "Sacred Moments II", sub: "Festive Wear" },
  { label: "Celestial Grace III", sub: "Lehenga" },
  { label: "Moonlit Elegance IV", sub: "Sarees" },
  { label: "Golden Devotion V", sub: "Designer" },
  { label: "Eternal Bloom VI", sub: "Premium" },
];

const SERVICES = [
  {
    icon: "🌙",
    title: "Guidance",
    desc: "Personal styling advice rooted in spiritual aesthetics. We help you find attire that resonates with your inner divine energy.",
    category: "products",
  },
  {
    icon: "💫",
    title: "Love Reading",
    desc: "Curated collections inspired by the eternal bond of Radha and Krishna — perfect for weddings and sacred unions.",
    category: "categories",
  },
  {
    icon: "🌸",
    title: "Healing",
    desc: "Outfits crafted to elevate your spirit. Each garment carries the energy of devotion, grace, and timeless beauty.",
    category: "contact",
  },
];

function useMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return mouse;
}

function TiltCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.1s ease",
      }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {children}
    </div>
  );
}

export default function Home({ onNavigate }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [hoveredGallery, setHoveredGallery] = useState<number | null>(null);
  const mouse = useMouse();
  const { cart, wishlist, user, logout } = useStore();

  const featured = products.slice(0, 8);
  const filtered = activeCategory
    ? featured.filter((p) => p.categoryId === activeCategory)
    : featured;

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: "easeOut" as const },
  };

  return (
    <div
      style={{ background: "#050810", minHeight: "100vh", color: "#e8f4ff" }}
    >
      {/* ── Three.js Canvas (fixed bg) ── */}
      <MoonCanvas />

      {/* ══════════════ HERO ══════════════ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        {/* Moon */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: `translate(calc(-50% + ${mouse.x * -12}px), ${mouse.y * -8}px)`,
            width: "clamp(180px, 28vw, 380px)",
            height: "clamp(180px, 28vw, 380px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 35%, #f5faff 0%, #c8dfff 40%, #7bacd4 100%)",
            boxShadow:
              "0 0 80px 40px rgba(220,235,255,0.35), 0 0 160px 80px rgba(180,210,255,0.18), 0 0 240px 120px rgba(140,180,255,0.08)",
            animation: "moonGlow 4s ease-in-out infinite",
            zIndex: 1,
            transition: "transform 0.15s ease",
          }}
        />

        {/* Fog layers */}
        {[
          { id: "fog-1", top: "55%", opacity: 0.18, delay: 0, dur: 18 },
          { id: "fog-2", top: "65%", opacity: 0.12, delay: 6, dur: 24 },
          { id: "fog-3", top: "75%", opacity: 0.1, delay: 3, dur: 20 },
        ].map((fog) => (
          <div
            key={fog.id}
            style={{
              position: "absolute",
              left: "-20%",
              right: "-20%",
              top: fog.top,
              height: "120px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(180,210,255,0.4) 30%, rgba(200,220,255,0.6) 50%, rgba(180,210,255,0.4) 70%, transparent 100%)",
              opacity: fog.opacity,
              filter: "blur(8px)",
              animation: `fogDrift ${fog.dur}s linear ${fog.delay}s infinite alternate`,
              zIndex: 2,
              pointerEvents: "none",
              transform: `translateX(${mouse.x * 15}px)`,
              transition: "transform 0.3s ease",
            }}
          />
        ))}

        {/* Tree silhouettes */}
        <svg
          role="img"
          aria-label="Left tree silhouette"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: "75vh",
            width: "auto",
            zIndex: 3,
            pointerEvents: "none",
            transform: `translateX(${mouse.x * -8}px)`,
            transition: "transform 0.2s ease",
          }}
          viewBox="0 0 140 900"
          preserveAspectRatio="xMinYMax meet"
        >
          <path d={LEFT_TREE} fill="#01020a" />
        </svg>
        <svg
          role="img"
          aria-label="Right tree silhouette"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            height: "75vh",
            width: "auto",
            zIndex: 3,
            pointerEvents: "none",
            transform: `translateX(${mouse.x * 8}px)`,
            transition: "transform 0.2s ease",
          }}
          viewBox="720 0 140 900"
          preserveAspectRatio="xMaxYMax meet"
        >
          <path d={RIGHT_TREE} fill="#01020a" />
        </svg>

        {/* Characters — hero image with silhouette treatment */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "8%",
            transform: `translate(calc(-50% + ${mouse.x * -20}px), ${mouse.y * -10}px)`,
            width: "clamp(260px, 50vw, 700px)",
            zIndex: 4,
            pointerEvents: "none",
            transition: "transform 0.18s ease",
          }}
        >
          <img
            src="/assets/generated/radha-krishna-hero.dim_1600x900.jpg"
            alt="Radha Krishna divine silhouette"
            style={{
              width: "100%",
              height: "auto",
              filter: "brightness(0.25) contrast(1.4) saturate(0.3)",
              mixBlendMode: "luminosity",
              objectFit: "contain",
              objectPosition: "bottom",
            }}
          />
          {/* Soft glow aura around characters */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 60%, rgba(249,168,37,0.12) 0%, transparent 70%)",
              animation: "moonGlow 3s ease-in-out infinite",
            }}
          />
        </div>

        {/* Foreground leaves */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "18vh",
            background:
              "linear-gradient(to top, #01020a 0%, #030609 50%, transparent 100%)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "14vh",
            left: 0,
            right: 0,
            height: "8px",
            background:
              "linear-gradient(90deg, #01251a 0%, #011a10 50%, #01251a 100%)",
            opacity: 0.8,
            zIndex: 6,
            pointerEvents: "none",
            transform: `translateX(${mouse.x * 30}px)`,
            transition: "transform 0.1s ease",
          }}
        />

        {/* ── NAVBAR ── */}
        <nav
          className="absolute top-0 left-0 right-0 z-20"
          style={{
            background: "rgba(5,8,16,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(249,168,37,0.2)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <button
                type="button"
                onClick={() => onNavigate("home")}
                data-ocid="nav.home_link"
                className="flex-shrink-0"
              >
                <img
                  src="/assets/uploads/radhey-radhey-unique-colection-1.jpeg"
                  alt="Radhey Radhey Unique Collection"
                  className="h-10 md:h-14 w-auto object-contain"
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(249,168,37,0.4))",
                  }}
                />
              </button>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-8">
                {[
                  { label: "Home", page: "home" },
                  { label: "Collection", page: "products" },
                  { label: "Categories", page: "categories" },
                  { label: "Contact", page: "contact" },
                ].map((link) => (
                  <button
                    key={link.page + link.label}
                    type="button"
                    onClick={() => onNavigate(link.page)}
                    data-ocid={`nav.${link.label.toLowerCase()}_link`}
                    className="text-sm font-medium tracking-widest transition-all hover:scale-105"
                    style={{
                      color: "#c8d8f0",
                      fontFamily: "Poppins, sans-serif",
                      textShadow: "0 0 10px rgba(249,168,37,0)",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = "#f9a825";
                      (e.target as HTMLElement).style.textShadow =
                        "0 0 12px rgba(249,168,37,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = "#c8d8f0";
                      (e.target as HTMLElement).style.textShadow = "none";
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("wishlist")}
                  data-ocid="nav.wishlist_link"
                  className="relative p-2 transition-all hover:scale-110"
                  style={{ color: wishlist.length > 0 ? "#f9a825" : "#c8d8f0" }}
                >
                  <Heart
                    size={18}
                    fill={wishlist.length > 0 ? "#f9a825" : "none"}
                  />
                  {wishlist.length > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                      style={{ background: "#f9a825", color: "#050810" }}
                    >
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("cart")}
                  data-ocid="nav.cart_link"
                  className="relative p-2 transition-all hover:scale-110"
                  style={{ color: cart.length > 0 ? "#f9a825" : "#c8d8f0" }}
                >
                  <ShoppingCart size={18} />
                  {cart.length > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                      style={{ background: "#f9a825", color: "#050810" }}
                    >
                      {cart.length}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      user
                        ? setUserMenuOpen(!userMenuOpen)
                        : onNavigate("login")
                    }
                    data-ocid="nav.user_link"
                    className="p-2 transition-all hover:scale-110"
                    style={{ color: user ? "#f9a825" : "#c8d8f0" }}
                  >
                    <User size={18} />
                  </button>
                  {userMenuOpen && user && (
                    <div
                      className="absolute right-0 top-full mt-1 w-44 rounded-xl py-2 z-50"
                      style={{
                        background: "rgba(8,12,24,0.95)",
                        border: "1px solid rgba(249,168,37,0.3)",
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                        style={{
                          color: "#c8d8f0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                        onClick={() => {
                          onNavigate("dashboard");
                          setUserMenuOpen(false);
                        }}
                        data-ocid="nav.dashboard_link"
                      >
                        My Dashboard
                      </button>
                      {user.email.includes("admin") && (
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                          style={{
                            color: "#f9a825",
                            fontFamily: "Poppins, sans-serif",
                          }}
                          onClick={() => {
                            onNavigate("admin");
                            setUserMenuOpen(false);
                          }}
                          data-ocid="nav.admin_link"
                        >
                          Admin Panel
                        </button>
                      )}
                      <hr
                        style={{
                          borderColor: "rgba(249,168,37,0.15)",
                          margin: "4px 0",
                        }}
                      />
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                        style={{
                          color: "#c8d8f0",
                          fontFamily: "Poppins, sans-serif",
                        }}
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        data-ocid="nav.logout_button"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="md:hidden p-2"
                  style={{ color: "#c8d8f0" }}
                  onClick={() => setMobileOpen(!mobileOpen)}
                  data-ocid="nav.mobile_menu_button"
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* Mobile nav */}
            {mobileOpen && (
              <div
                className="md:hidden pb-4"
                style={{ borderTop: "1px solid rgba(249,168,37,0.15)" }}
              >
                {[
                  { label: "Home", page: "home" },
                  { label: "Collection", page: "products" },
                  { label: "Categories", page: "categories" },
                  { label: "Contact", page: "contact" },
                ].map((link) => (
                  <button
                    key={link.page}
                    type="button"
                    onClick={() => {
                      onNavigate(link.page);
                      setMobileOpen(false);
                    }}
                    data-ocid={`nav.${link.label.toLowerCase()}_mobile_link`}
                    className="block w-full text-left px-2 py-3 text-sm tracking-wider"
                    style={{
                      color: "#c8d8f0",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ── Hero Content ── */}
        <div
          className="relative flex flex-col items-center justify-center text-center px-4"
          style={{
            minHeight: "100vh",
            paddingTop: "80px",
            zIndex: 10,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p
              className="text-xs tracking-[0.4em] mb-4"
              style={{
                color: "rgba(249,168,37,0.7)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              ✦ DIVINE COLLECTION ✦
            </p>
            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-2"
              style={{
                fontFamily: "'Cinzel Decorative', 'Playfair Display', serif",
                color: "#f9a825",
                textShadow:
                  "0 0 30px rgba(249,168,37,0.6), 0 0 60px rgba(249,168,37,0.3), 0 0 100px rgba(249,168,37,0.15)",
                animation: "goldPulse 3s ease-in-out infinite",
              }}
            >
              Radhey Radhey
            </h1>
            <h2
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6"
              style={{
                fontFamily: "'Cinzel Decorative', 'Playfair Display', serif",
                color: "#ffd54f",
                textShadow:
                  "0 0 20px rgba(255,213,79,0.5), 0 0 40px rgba(249,168,37,0.25)",
              }}
            >
              Unique Collection
            </h2>
            <p
              className="text-sm md:text-base tracking-[0.2em] mb-10"
              style={{ color: "#c8d8f0", fontFamily: "Poppins, sans-serif" }}
            >
              ✦ Where Divine Love Meets Timeless Grace ✦
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                type="button"
                onClick={() => onNavigate("products")}
                data-ocid="home.explore_button"
                className="px-8 py-4 rounded-full text-sm font-medium tracking-widest transition-all hover:scale-105"
                style={{
                  background: "rgba(249,168,37,0.15)",
                  border: "1px solid rgba(249,168,37,0.6)",
                  color: "#f9a825",
                  backdropFilter: "blur(10px)",
                  fontFamily: "Poppins, sans-serif",
                  boxShadow: "0 0 20px rgba(249,168,37,0.15)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(249,168,37,0.3)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 30px rgba(249,168,37,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(249,168,37,0.15)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 20px rgba(249,168,37,0.15)";
                }}
              >
                ✦ Explore
              </button>
              <button
                type="button"
                onClick={() => onNavigate("products")}
                data-ocid="home.enter_experience_button"
                className="px-8 py-4 rounded-full text-sm font-medium tracking-widest transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#e8f4ff",
                  backdropFilter: "blur(10px)",
                  fontFamily: "Poppins, sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.08)";
                }}
              >
                Enter Experience
              </button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8"
            style={{ color: "#c8d8f0", zIndex: 10 }}
          >
            <ChevronDown
              size={24}
              style={{ animation: "bounce 2s ease-in-out infinite" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section
        style={{
          background: "linear-gradient(180deg, #0a0e1a 0%, #0d1220 100%)",
          padding: "100px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Gold divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(249,168,37,0.6), transparent)",
            marginBottom: "80px",
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image card */}
            <motion.div {...fadeUp}>
              <div
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid rgba(249,168,37,0.3)",
                  boxShadow:
                    "0 0 40px rgba(249,168,37,0.15), 0 20px 60px rgba(0,0,0,0.4)",
                  background: "rgba(249,168,37,0.04)",
                }}
              >
                <img
                  src="/assets/generated/radha-krishna-hero.dim_1600x900.jpg"
                  alt="Radha Krishna divine art"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    filter: "brightness(0.85) saturate(1.1)",
                  }}
                />
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
              <p
                className="text-xs tracking-[0.4em] mb-4"
                style={{
                  color: "rgba(249,168,37,0.7)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                OUR STORY
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#f9a825",
                  textShadow: "0 0 20px rgba(249,168,37,0.3)",
                }}
              >
                The Spirit of Radhe Radhe
              </h2>
              <div
                style={{
                  width: "60px",
                  height: "2px",
                  background: "linear-gradient(90deg, #f9a825, transparent)",
                  marginBottom: "24px",
                }}
              />
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: "#c8d8f0", fontFamily: "Poppins, sans-serif" }}
              >
                Radhe Radhe Unique Collection celebrates the timeless beauty of
                Indian traditions. Each piece is handpicked to embody grace,
                devotion, and elegance — perfect for weddings, festivals, and
                sacred celebrations.
              </p>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{
                  color: "rgba(200,216,240,0.7)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                We believe every woman deserves to feel divine. Our curated
                range of traditional and contemporary Indian wear brings the
                spirit of Radha's eternal grace to life through every thread and
                embellishment.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("contact")}
                data-ocid="home.story_cta_button"
                className="px-8 py-3 rounded-full text-sm font-medium tracking-widest transition-all hover:scale-105"
                style={{
                  background: "rgba(249,168,37,0.12)",
                  border: "1px solid rgba(249,168,37,0.5)",
                  color: "#f9a825",
                  fontFamily: "Poppins, sans-serif",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(249,168,37,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(249,168,37,0.12)";
                }}
              >
                Learn More About Us
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════ SERVICES ══════════════ */}
      <section
        style={{
          background: "#080c18",
          padding: "100px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p
              className="text-xs tracking-[0.4em] mb-4"
              style={{
                color: "rgba(249,168,37,0.7)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              WHAT WE OFFER
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#f9a825",
                textShadow: "0 0 20px rgba(249,168,37,0.3)",
              }}
            >
              Sacred Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <TiltCard
                  className="cursor-pointer h-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(249,168,37,0.2)",
                    borderRadius: "20px",
                    backdropFilter: "blur(16px)",
                    padding: "40px 32px",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
                    style={{
                      background: "rgba(249,168,37,0.1)",
                      border: "1px solid rgba(249,168,37,0.2)",
                    }}
                  >
                    {svc.icon}
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      fontFamily: "'Cinzel Decorative', serif",
                      color: "#f9a825",
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{
                      color: "rgba(200,216,240,0.8)",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {svc.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate(svc.category)}
                    data-ocid={`home.service.${svc.title.toLowerCase().replace(" ", "_")}_button`}
                    className="text-xs tracking-widest transition-all hover:scale-105"
                    style={{
                      color: "rgba(249,168,37,0.7)",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Explore →
                  </button>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      <section
        style={{
          background: "linear-gradient(180deg, #080c18 0%, #0a0e1a 100%)",
          padding: "100px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p
              className="text-xs tracking-[0.4em] mb-4"
              style={{
                color: "rgba(249,168,37,0.7)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              CURATED FOR YOU
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#f9a825",
                textShadow: "0 0 20px rgba(249,168,37,0.3)",
              }}
            >
              Divine Collection
            </h2>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  data-ocid={`home.category_${cat.id || "all"}_tab`}
                  className="px-5 py-2 rounded-full text-xs tracking-widest transition-all hover:scale-105"
                  style={{
                    background:
                      activeCategory === cat.id
                        ? "rgba(249,168,37,0.25)"
                        : "rgba(255,255,255,0.05)",
                    border:
                      activeCategory === cat.id
                        ? "1px solid rgba(249,168,37,0.7)"
                        : "1px solid rgba(255,255,255,0.1)",
                    color: activeCategory === cat.id ? "#f9a825" : "#c8d8f0",
                    fontFamily: "Poppins, sans-serif",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      activeCategory === cat.id
                        ? "0 0 12px rgba(249,168,37,0.2)"
                        : "none",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product grid — wrapped in dark theme */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            data-ocid="home.products.list"
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(249,168,37,0.1)",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                data-ocid={`home.products.item.${i + 1}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(249,168,37,0.35)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(249,168,37,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(249,168,37,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <ProductCard product={product} onNavigate={onNavigate} />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="text-center py-16"
              data-ocid="home.products.empty_state"
              style={{
                color: "rgba(200,216,240,0.5)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              No items in this category yet.
            </div>
          )}

          <motion.div {...fadeUp} className="text-center mt-12">
            <button
              type="button"
              onClick={() => onNavigate("products")}
              data-ocid="home.view_all_button"
              className="px-10 py-4 rounded-full text-sm tracking-widest transition-all hover:scale-105"
              style={{
                background: "rgba(249,168,37,0.12)",
                border: "1px solid rgba(249,168,37,0.4)",
                color: "#f9a825",
                fontFamily: "Poppins, sans-serif",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(249,168,37,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(249,168,37,0.12)";
              }}
            >
              View Full Collection
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ GALLERY ══════════════ */}
      <section
        style={{
          background: "#0a0e1a",
          padding: "100px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p
              className="text-xs tracking-[0.4em] mb-4"
              style={{
                color: "rgba(249,168,37,0.7)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              VISUAL JOURNEY
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#f9a825",
                textShadow: "0 0 20px rgba(249,168,37,0.3)",
              }}
            >
              Sacred Gallery
            </h2>
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="home.gallery.list"
          >
            {GALLERY_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredGallery(i)}
                onMouseLeave={() => setHoveredGallery(null)}
                data-ocid={`home.gallery.item.${i + 1}`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(249,168,37,0.1) 100%)",
                  border:
                    hoveredGallery === i
                      ? "1px solid rgba(249,168,37,0.6)"
                      : "1px solid rgba(249,168,37,0.15)",
                  borderRadius: "16px",
                  height: "200px",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow:
                    hoveredGallery === i
                      ? "0 0 40px rgba(249,168,37,0.3), inset 0 0 40px rgba(124,58,237,0.1)"
                      : "none",
                  transform: hoveredGallery === i ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: hoveredGallery === i ? 0 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <span style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
                    ✦
                  </span>
                  <p
                    style={{
                      color: "rgba(249,168,37,0.8)",
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: "0.9rem",
                      textAlign: "center",
                      padding: "0 16px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      color: "rgba(200,216,240,0.5)",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.7rem",
                      marginTop: "4px",
                    }}
                  >
                    {item.sub}
                  </p>
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: hoveredGallery === i ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    background: "rgba(5,8,16,0.5)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <p
                    style={{
                      color: "#f9a825",
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: "1rem",
                      textAlign: "center",
                      padding: "0 16px",
                    }}
                  >
                    {item.label}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate("products")}
                    className="mt-4 px-5 py-2 rounded-full text-xs tracking-wider"
                    style={{
                      background: "rgba(249,168,37,0.2)",
                      border: "1px solid rgba(249,168,37,0.5)",
                      color: "#f9a825",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    View Collection
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section
        style={{
          background: "linear-gradient(180deg, #0a0e1a 0%, #0d1220 100%)",
          padding: "100px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p
              className="text-xs tracking-[0.4em] mb-4"
              style={{
                color: "rgba(249,168,37,0.7)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              THE PROCESS
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#f9a825",
                textShadow: "0 0 20px rgba(249,168,37,0.3)",
              }}
            >
              How It Works
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Browse",
                desc: "Explore handpicked outfits curated for weddings, festivals, and sacred celebrations.",
                icon: "🌸",
              },
              {
                num: "02",
                title: "Select Dates",
                desc: "Choose your rental period from 3 to 10 days at your convenience.",
                icon: "📅",
              },
              {
                num: "03",
                title: "Book & Pay",
                desc: "Secure checkout with instant booking confirmation.",
                icon: "✨",
              },
              {
                num: "04",
                title: "Wear & Return",
                desc: "Enjoy your divine outfit and return it to our store after your celebration.",
                icon: "🙏",
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                data-ocid={`home.step.item.${i + 1}`}
                className="text-center p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(249,168,37,0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <p
                  className="text-4xl font-bold mb-2"
                  style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    color: "rgba(249,168,37,0.3)",
                  }}
                >
                  {step.num}
                </p>
                <h3
                  className="font-bold text-base mb-2"
                  style={{
                    color: "#f9a825",
                    fontFamily: "'Cinzel Decorative', serif",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(200,216,240,0.7)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CONTACT / BOOKING ══════════════ */}
      <section
        style={{
          background:
            "radial-gradient(ellipse at center, #0d1530 0%, #050810 100%)",
          padding: "100px 0",
          position: "relative",
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        {/* Decorative moon glow behind form */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p
              className="text-xs tracking-[0.4em] mb-4"
              style={{
                color: "rgba(249,168,37,0.7)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              GET IN TOUCH
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#f9a825",
                textShadow: "0 0 20px rgba(249,168,37,0.3)",
              }}
            >
              Book Your Divine Look
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(249,168,37,0.2)",
              borderRadius: "24px",
              backdropFilter: "blur(20px)",
              padding: "clamp(24px, 5vw, 48px)",
            }}
            data-ocid="home.contact.panel"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs tracking-wider mb-2"
                  style={{
                    color: "rgba(200,216,240,0.7)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="home.contact.name.input"
                  className="w-full px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    color: "#e8f4ff",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(249,168,37,0.5)";
                    e.target.style.boxShadow = "0 0 12px rgba(249,168,37,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs tracking-wider mb-2"
                  style={{
                    color: "rgba(200,216,240,0.7)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  data-ocid="home.contact.email.input"
                  className="w-full px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    color: "#e8f4ff",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(249,168,37,0.5)";
                    e.target.style.boxShadow = "0 0 12px rgba(249,168,37,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="contact-phone"
                className="block text-xs tracking-wider mb-2"
                style={{
                  color: "rgba(200,216,240,0.7)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
                data-ocid="home.contact.phone.input"
                className="w-full px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "#e8f4ff",
                  fontFamily: "Poppins, sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(249,168,37,0.5)";
                  e.target.style.boxShadow = "0 0 12px rgba(249,168,37,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="contact-message"
                className="block text-xs tracking-wider mb-2"
                style={{
                  color: "rgba(200,216,240,0.7)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="Tell us about the occasion, your size preference, or any questions..."
                value={formData.message}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, message: e.target.value }))
                }
                data-ocid="home.contact.message.textarea"
                className="w-full px-4 py-3 text-sm outline-none resize-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  color: "#e8f4ff",
                  fontFamily: "Poppins, sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(249,168,37,0.5)";
                  e.target.style.boxShadow = "0 0 12px rgba(249,168,37,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <button
              type="button"
              data-ocid="home.contact.submit_button"
              className="w-full py-4 rounded-xl text-sm font-bold tracking-widest transition-all hover:scale-[1.02] hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #f9a825, #f57f17)",
                color: "#050810",
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0 4px 20px rgba(249,168,37,0.3)",
              }}
            >
              ✦ Send Message
            </button>

            {/* Business info */}
            <div
              className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
              style={{ borderTop: "1px solid rgba(249,168,37,0.15)" }}
            >
              {[
                { label: "Shop", value: "Radhe Radhe Unique Collection" },
                { label: "Owner", value: "Rekha Khemka" },
                { label: "Email", value: "kavyanshkhemka@gmail.com" },
                { label: "Contact", value: "9811254719 / 9817266196" },
                {
                  label: "Address",
                  value: "Ganesh Apartment 204, Near Gate No. 6, Birgunj",
                },
              ].map((info) => (
                <div key={info.label}>
                  <p
                    className="text-[10px] tracking-widest mb-1"
                    style={{
                      color: "rgba(249,168,37,0.6)",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {info.label.toUpperCase()}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: "#c8d8f0",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {info.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer
        style={{
          background: "#030508",
          borderTop: "1px solid rgba(249,168,37,0.15)",
          padding: "40px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src="/assets/uploads/radhey-radhey-unique-colection-1.jpeg"
            alt="Radhe Radhe Unique Collection"
            style={{
              height: "48px",
              width: "auto",
              objectFit: "contain",
              margin: "0 auto 16px",
              filter: "drop-shadow(0 2px 8px rgba(249,168,37,0.3))",
            }}
          />
          <p
            className="text-xs tracking-widest mb-4"
            style={{
              color: "rgba(200,216,240,0.4)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            ✦ RADHE RADHE UNIQUE COLLECTION ✦
          </p>
          <div className="flex flex-wrap gap-6 justify-center mb-6">
            {[
              { label: "Collection", page: "products" },
              { label: "Categories", page: "categories" },
              { label: "Wishlist", page: "wishlist" },
              { label: "Contact", page: "contact" },
            ].map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => onNavigate(link.page)}
                data-ocid={`footer.${link.page}_link`}
                className="text-xs tracking-wider transition-all"
                style={{
                  color: "rgba(200,216,240,0.5)",
                  fontFamily: "Poppins, sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#f9a825";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color =
                    "rgba(200,216,240,0.5)";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
          <p
            className="text-xs"
            style={{
              color: "rgba(200,216,240,0.3)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            © {new Date().getFullYear()}. Built with{" "}
            <span style={{ color: "#f9a825" }}>♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(249,168,37,0.6)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* ══════════════ MUSIC TOGGLE ══════════════ */}
      <button
        type="button"
        onClick={() => setMusicPlaying(!musicPlaying)}
        data-ocid="home.music_toggle"
        title={
          musicPlaying
            ? "Pause ambient flute music"
            : "Play ambient flute music"
        }
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 100,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "rgba(249,168,37,0.15)",
          border: "1px solid rgba(249,168,37,0.4)",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          gap: "2px",
          animation: musicPlaying
            ? "musicPulse 1.5s ease-in-out infinite"
            : "none",
          transition: "background 0.3s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            "rgba(249,168,37,0.3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            "rgba(249,168,37,0.15)";
        }}
      >
        {musicPlaying ? (
          <Music size={18} color="#f9a825" />
        ) : (
          <VolumeX size={18} color="rgba(249,168,37,0.7)" />
        )}
        <span
          style={{
            fontSize: "8px",
            color: "rgba(249,168,37,0.7)",
            fontFamily: "Poppins, sans-serif",
            lineHeight: 1,
          }}
        >
          Flute
        </span>
      </button>
    </div>
  );
}
