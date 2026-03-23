import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import img11 from "../assets/1.1.jpeg";
import img12 from "../assets/1.2.jpeg";
import img13 from "../assets/1.3.jpeg";
import img14 from "../assets/1.4.jpeg";
import img15 from "../assets/1.5.jpeg";
import logoImg from "../assets/LOGO.jpeg";
import PetalScene from "../components/PetalScene";

interface HomeProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const HERO_IMAGES = [img15, img11, img14, img12, img13];

const GALLERY_IMAGES = [
  {
    src: img15,
    title: "Moonlit Devotion",
    sub: "Krishna & Radha by the Sacred Lake",
  },
  {
    src: img11,
    title: "Rose Petal Love",
    sub: "Golden Lamps & Eternal Devotion",
  },
  {
    src: img14,
    title: "Golden Swing",
    sub: "Radha Swings in Divine Grace",
  },
  {
    src: img12,
    title: "Temple Offering",
    sub: "Bowing at Sacred Pillars",
  },
  {
    src: img13,
    title: "Riverside Peacock",
    sub: "Adorned Feet by Mystic Waters",
  },
];

const SERVICES = [
  {
    icon: "🪷",
    title: "Sacred Collections",
    desc: "Luxury attire for divine occasions — weddings, pujas, and sacred ceremonies. Each piece carries the essence of devotion.",
    image: img11,
    page: "products",
  },
  {
    icon: "🦚",
    title: "Bridal Blessing",
    desc: "Celestial bridal and ceremony rentals inspired by Radha's divine grace. Step into your most sacred moment.",
    image: img14,
    page: "categories",
  },
  {
    icon: "🪔",
    title: "Festival Adornments",
    desc: "Traditional and festive wear that celebrates the vibrant spirit of Indian culture and devotional celebrations.",
    image: img12,
    page: "products",
  },
];

function useMouse() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      ref.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return ref;
}

function TiltCard({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -10,
      y: ((e.clientX - cx) / (rect.width / 2)) * 10,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

function FloatingPetals() {
  const petals = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${5 + ((i * 4.7) % 92)}%`,
    delay: `${(i * 0.8) % 14}s`,
    duration: `${10 + ((i * 1.3) % 8)}s`,
    size: `${10 + ((i * 3) % 14)}px`,
    emoji: i % 3 === 0 ? "🌸" : i % 3 === 1 ? "✿" : "❀",
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute petal text-pink-300/40"
          style={{
            left: p.left,
            top: "-20px",
            fontSize: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

export default function Home({ onNavigate }: HomeProps) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [entryDone, setEntryDone] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const mouse = useMouse();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Hero image cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => {
        setPrevIdx(prev);
        return (prev + 1) % HERO_IMAGES.length;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Entry transition done after 2.5s
  useEffect(() => {
    const t = setTimeout(() => setEntryDone(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: "", phone: "", message: "" });
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#0d0d2b" }}
    >
      {/* Floating CSS petals */}
      <FloatingPetals />

      {/* Entry divine transition */}
      <AnimatePresence>
        {!entryDone && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(212,175,55,0.95) 0%, rgba(184,134,11,0.7) 30%, rgba(13,13,43,0.95) 70%, #0d0d2b 100%)",
              }}
            />
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.4, opacity: [0, 1, 0] }}
              transition={{ duration: 2.2, ease: "easeOut" }}
            >
              <div className="text-6xl mb-4">🪷</div>
              <p
                className="text-2xl font-display tracking-widest"
                style={{
                  color: "#0d0d2b",
                  fontFamily: "'Cinzel Decorative', serif",
                }}
              >
                Radhe Radhe
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100svh", minHeight: "600px" }}
        data-ocid="hero.section"
      >
        {/* Three.js canvas background */}
        <div className="absolute inset-0 z-0">
          <PetalScene mouse={mouse} />
        </div>

        {/* Deep gradient overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,13,43,0.5) 0%, rgba(13,13,43,0.2) 40%, rgba(13,13,43,0.7) 100%)",
          }}
        />

        {/* Hero image carousel */}
        <motion.div
          className="absolute inset-0 z-[2]"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {HERO_IMAGES.map((src, i) => (
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === heroIdx ? 1 : 0 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              style={{ zIndex: i === heroIdx ? 2 : i === prevIdx ? 1 : 0 }}
            >
              <img
                src={src}
                alt="Divine scene"
                className="w-full h-full"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              {/* Cinematic overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(13,13,43,0.3) 0%, rgba(13,13,43,0.1) 30%, rgba(13,13,43,0.0) 50%, rgba(13,13,43,0.5) 80%, rgba(13,13,43,0.9) 100%)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Hero text content */}
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-center px-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.8 }}
            className="mb-5"
          >
            <img
              src={logoImg}
              alt="Radhe Radhe Unique Collection"
              className="h-16 md:h-20 mx-auto rounded-full"
              style={{
                border: "2px solid rgba(212,175,55,0.6)",
                boxShadow: "0 0 30px rgba(212,175,55,0.3)",
              }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 1 }}
            className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-3"
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              color: "#D4AF37",
              textShadow:
                "0 0 30px rgba(212,175,55,0.6), 0 0 60px rgba(212,175,55,0.3), 0 2px 8px rgba(0,0,0,0.8)",
              animation: "goldPulse 3s ease-in-out infinite",
            }}
          >
            Radhey Radhey
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9, duration: 1 }}
            className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3"
            style={{
              fontFamily: "'Cinzel Decorative', serif",
              color: "#ffe082",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            Unique Collection
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.1, duration: 1 }}
            className="text-sm sm:text-base md:text-lg mb-8 tracking-widest"
            style={{
              color: "#f5f0e8",
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
              letterSpacing: "0.2em",
            }}
          >
            ✦ A Sacred Love · An Eternal Journey ✦
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              type="button"
              onClick={() => onNavigate("products")}
              className="px-8 py-3 text-sm tracking-widest transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.7)",
                color: "#D4AF37",
                backdropFilter: "blur(12px)",
                borderRadius: "4px",
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                animation: "goldPulse 3s ease-in-out infinite",
                textShadow: "0 0 10px rgba(212,175,55,0.5)",
              }}
              data-ocid="hero.primary_button"
            >
              ✦ Enter Divine Experience ✦
            </button>
            <button
              type="button"
              onClick={() => onNavigate("categories")}
              className="px-6 py-3 text-sm tracking-widest transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(13,13,43,0.4)",
                border: "1px solid rgba(245,240,232,0.3)",
                color: "#f5f0e8",
                backdropFilter: "blur(12px)",
                borderRadius: "4px",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
              }}
              data-ocid="hero.secondary_button"
            >
              Browse Collections
            </button>
          </motion.div>

          {/* Hero image indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="absolute bottom-8 flex gap-2"
          >
            {HERO_IMAGES.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => {
                  setPrevIdx(heroIdx);
                  setHeroIdx(i);
                }}
                className="transition-all duration-300"
                style={{
                  width: i === heroIdx ? "24px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background:
                    i === heroIdx ? "#D4AF37" : "rgba(212,175,55,0.35)",
                }}
                data-ocid="hero.tab"
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </motion.div>
        </div>

        {/* Lotus decorators */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 z-[3] pointer-events-none"
          style={{
            background: "linear-gradient(to top, #0d0d2b, transparent)",
          }}
        />
      </section>

      {/* ═══════════════════════════════════════
          ABOUT SECTION
      ═══════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0d0d2b 0%, #0a1628 40%, #003d33 80%, #0d0d2b 100%)",
        }}
        data-ocid="about.section"
      >
        {/* Decorative gold line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, #D4AF37, transparent)",
          }}
        />

        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 60px rgba(212,175,55,0.2), 0 0 120px rgba(212,175,55,0.08)",
                }}
              >
                <img
                  src={img15}
                  alt="Krishna and Radha by the moonlit lake"
                  className="w-full h-[420px] md:h-[500px] object-cover"
                />
                {/* Shimmer border */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ border: "1px solid rgba(212,175,55,0.4)" }}
                />
              </div>
              {/* Gold decorative corner */}
              <div
                className="absolute -top-3 -left-3 w-16 h-16 pointer-events-none"
                style={{
                  borderTop: "2px solid #D4AF37",
                  borderLeft: "2px solid #D4AF37",
                }}
              />
              <div
                className="absolute -bottom-3 -right-3 w-16 h-16 pointer-events-none"
                style={{
                  borderBottom: "2px solid #D4AF37",
                  borderRight: "2px solid #D4AF37",
                }}
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <p
                className="text-xs tracking-widest mb-4"
                style={{ color: "#D4AF37", letterSpacing: "0.3em" }}
              >
                ✦ DIVINE LOVE STORY ✦
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#ffe082",
                  textShadow: "0 0 20px rgba(212,175,55,0.3)",
                }}
              >
                The Eternal
                <br />
                <span style={{ color: "#D4AF37" }}>Love Story</span>
              </h2>
              {/* Gold underline */}
              <div
                className="w-24 h-0.5 mb-8"
                style={{
                  background: "linear-gradient(to right, #D4AF37, transparent)",
                }}
              />
              <p
                className="text-base md:text-lg leading-relaxed mb-5"
                style={{ color: "rgba(245,240,232,0.85)", lineHeight: "1.9" }}
              >
                In the divine realm of Vrindavan, where moonlight dances on
                lotus ponds and peacocks sing of immortal love — Radha and
                Krishna exist in eternal union. Their love is not merely a
                story; it is the universe's deepest truth.
              </p>
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: "rgba(245,240,232,0.7)", lineHeight: "1.9" }}
              >
                At Radhe Radhe Unique Collection, we honour this sacred bond
                through carefully curated attire — each garment woven with
                devotion, each thread carrying the fragrance of that eternal
                love. Dress not just for an occasion, but for the divine within
                you.
              </p>

              {/* Fabric flowing accent */}
              <div
                className="flex items-center gap-4"
                style={{ animation: "fabricFlow 4s ease-in-out infinite" }}
              >
                <div
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(to right, #D4AF37, rgba(212,175,55,0.2))",
                  }}
                />
                <span style={{ color: "#D4AF37", fontSize: "1.2rem" }}>🪷</span>
                <span
                  className="text-xs tracking-widest"
                  style={{
                    color: "rgba(212,175,55,0.7)",
                    letterSpacing: "0.25em",
                  }}
                >
                  Rekha Khemka · Birgunj
                </span>
                <span style={{ color: "#D4AF37", fontSize: "1.2rem" }}>🪷</span>
                <div
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(to left, #D4AF37, rgba(212,175,55,0.2))",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom deco line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, #D4AF37, transparent)",
          }}
        />
      </section>

      {/* ═══════════════════════════════════════
          SERVICES SECTION
      ═══════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{ background: "#0d0d2b" }}
        data-ocid="services.section"
      >
        {/* Decorative particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={`p${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${(i * 8.3) % 100}%`,
                top: `${(i * 7.1) % 100}%`,
                background: "#D4AF37",
                opacity: 0.2,
                animation: `sparkle-pulse ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-widest mb-3"
              style={{ color: "#D4AF37", letterSpacing: "0.3em" }}
            >
              ✦ WHAT WE OFFER ✦
            </p>
            <h2
              className="text-3xl md:text-5xl font-bold"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#ffe082",
                textShadow: "0 0 20px rgba(212,175,55,0.3)",
              }}
            >
              Divine Offerings
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div
                className="h-px w-16"
                style={{ background: "rgba(212,175,55,0.4)" }}
              />
              <span style={{ color: "#D4AF37" }}>🪷</span>
              <div
                className="h-px w-16"
                style={{ background: "rgba(212,175,55,0.4)" }}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <TiltCard className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group">
                  {/* Background image */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(13,13,43,0.3) 0%, rgba(13,13,43,0.85) 100%)",
                    }}
                  />
                  {/* Glass card */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-7 transition-all duration-300"
                    style={{
                      background: "transparent",
                    }}
                  >
                    <div
                      className="mb-3 text-3xl"
                      style={{
                        animation: "divaFlicker 2.5s ease-in-out infinite",
                        animationDelay: `${i * 0.5}s`,
                      }}
                    >
                      {service.icon}
                    </div>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{
                        fontFamily: "'Cinzel Decorative', serif",
                        color: "#D4AF37",
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(245,240,232,0.8)" }}
                    >
                      {service.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate(service.page)}
                      className="mt-4 self-start text-xs tracking-widest px-5 py-2 transition-all duration-300"
                      style={{
                        border: "1px solid rgba(212,175,55,0.5)",
                        color: "#D4AF37",
                        borderRadius: "3px",
                        background: "rgba(13,13,43,0.4)",
                        backdropFilter: "blur(8px)",
                      }}
                      data-ocid={`services.item.${i + 1}`}
                    >
                      Explore →
                    </button>
                  </div>
                  {/* Hover gold border */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      border: "1px solid rgba(212,175,55,0.6)",
                      boxShadow: "inset 0 0 30px rgba(212,175,55,0.1)",
                    }}
                  />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          GALLERY SECTION
      ═══════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0d0d2b 0%, #050810 50%, #0d0d2b 100%)",
        }}
        data-ocid="gallery.section"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p
              className="text-xs tracking-widest mb-3"
              style={{ color: "#D4AF37", letterSpacing: "0.3em" }}
            >
              ✦ SACRED MOMENTS ✦
            </p>
            <h2
              className="text-3xl md:text-5xl font-bold"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#ffe082",
                textShadow: "0 0 20px rgba(212,175,55,0.3)",
              }}
            >
              Divine Gallery
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div
                className="h-px w-16"
                style={{ background: "rgba(212,175,55,0.4)" }}
              />
              <span style={{ color: "#D4AF37" }}>✦</span>
              <div
                className="h-px w-16"
                style={{ background: "rgba(212,175,55,0.4)" }}
              />
            </div>
          </motion.div>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map((item, i) => (
              <motion.div
                key={item.src}
                className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
                style={{ aspectRatio: i === 0 ? "16/10" : "4/3" }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setLightboxImg(i)}
                data-ocid={`gallery.item.${i + 1}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(13,13,43,0.9) 0%, transparent 60%)",
                    border: "1px solid rgba(212,175,55,0.4)",
                    borderRadius: "inherit",
                  }}
                >
                  <p
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "'Cinzel Decorative', serif",
                      color: "#D4AF37",
                      fontSize: "0.75rem",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(245,240,232,0.7)" }}
                  >
                    {item.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxImg !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{
                background: "rgba(5,8,16,0.95)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImg(null)}
              data-ocid="gallery.modal"
            >
              <motion.div
                className="relative max-w-4xl w-full max-h-[85vh]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={GALLERY_IMAGES[lightboxImg].src}
                  alt={GALLERY_IMAGES[lightboxImg].title}
                  className="w-full h-full object-contain rounded-xl"
                  style={{
                    maxHeight: "80vh",
                    border: "1px solid rgba(212,175,55,0.4)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setLightboxImg(null)}
                  className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{
                    background: "rgba(13,13,43,0.9)",
                    border: "1px solid rgba(212,175,55,0.5)",
                    color: "#D4AF37",
                  }}
                  data-ocid="gallery.close_button"
                >
                  ✕
                </button>
                <div className="mt-4 text-center">
                  <p
                    style={{
                      fontFamily: "'Cinzel Decorative', serif",
                      color: "#D4AF37",
                      fontSize: "0.9rem",
                    }}
                  >
                    {GALLERY_IMAGES[lightboxImg].title}
                  </p>
                  <p
                    style={{
                      color: "rgba(245,240,232,0.6)",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                    }}
                  >
                    {GALLERY_IMAGES[lightboxImg].sub}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT / BOOKING SECTION
      ═══════════════════════════════════════ */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #050810 0%, #0a1628 50%, #050810 100%)",
        }}
        data-ocid="contact.section"
      >
        {/* Top deco */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, #D4AF37, transparent)",
          }}
        />

        {/* Lotus decorators */}
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl opacity-30"
          style={{ animation: "floatUp 4s ease-in-out infinite" }}
        >
          🪷
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p
              className="text-xs tracking-widest mb-3"
              style={{ color: "#D4AF37", letterSpacing: "0.3em" }}
            >
              ✦ REACH US ✦
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: "#ffe082",
                textShadow: "0 0 20px rgba(212,175,55,0.3)",
              }}
            >
              Visit Our Sacred Space
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl p-8"
              style={{
                background: "rgba(13,13,43,0.6)",
                border: "1px solid rgba(212,175,55,0.3)",
                backdropFilter: "blur(20px)",
              }}
            >
              <h3
                className="text-lg font-bold mb-6"
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#D4AF37",
                  fontSize: "1rem",
                }}
              >
                🪔 Find Us
              </h3>
              <div className="space-y-5">
                {[
                  { icon: "👤", label: "Owner", value: "Rekha Khemka" },
                  {
                    icon: "📍",
                    label: "Address",
                    value: "Ganesh Apartment 204, Near Gate 6, Birgunj",
                  },
                  {
                    icon: "📞",
                    label: "Phone",
                    value: "+977 9811254719 · +977 9817266196",
                  },
                  {
                    icon: "✉️",
                    label: "Email",
                    value: "kavyanshkhemka@gmail.com",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <p
                        className="text-xs tracking-wider mb-1"
                        style={{ color: "rgba(212,175,55,0.6)" }}
                      >
                        {item.label.toUpperCase()}
                      </p>
                      <p
                        style={{
                          color: "rgba(245,240,232,0.9)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Diya flicker effect */}
              <div className="mt-8 flex items-center gap-3">
                <div
                  className="text-2xl"
                  style={{ animation: "divaFlicker 1.5s ease-in-out infinite" }}
                >
                  🪔
                </div>
                <p
                  className="text-xs"
                  style={{ color: "rgba(212,175,55,0.6)", lineHeight: "1.7" }}
                >
                  Open with love and devotion.
                  <br />
                  Every garment tells a divine story.
                </p>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="rounded-2xl p-8"
              style={{
                background: "rgba(13,13,43,0.6)",
                border: "1px solid rgba(212,175,55,0.3)",
                backdropFilter: "blur(20px)",
              }}
            >
              <h3
                className="text-lg font-bold mb-6"
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#D4AF37",
                  fontSize: "1rem",
                }}
              >
                🌸 Book an Inquiry
              </h3>
              {formSent ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  data-ocid="contact.success_state"
                >
                  <div className="text-5xl mb-4">🪷</div>
                  <p
                    style={{
                      color: "#D4AF37",
                      fontFamily: "'Cinzel Decorative', serif",
                    }}
                  >
                    Message Received
                  </p>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "rgba(245,240,232,0.6)" }}
                  >
                    We'll reach out with divine haste.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs tracking-wider mb-2"
                      style={{ color: "rgba(212,175,55,0.7)" }}
                    >
                      YOUR NAME
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Full name"
                      className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        borderRadius: "8px",
                        color: "#f5f0e8",
                      }}
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs tracking-wider mb-2"
                      style={{ color: "rgba(212,175,55,0.7)" }}
                    >
                      PHONE NUMBER
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="Your phone"
                      className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        borderRadius: "8px",
                        color: "#f5f0e8",
                      }}
                      data-ocid="contact.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs tracking-wider mb-2"
                      style={{ color: "rgba(212,175,55,0.7)" }}
                    >
                      MESSAGE
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Tell us about your occasion..."
                      rows={4}
                      className="w-full px-4 py-3 text-sm outline-none transition-all duration-200 resize-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        borderRadius: "8px",
                        color: "#f5f0e8",
                      }}
                      data-ocid="contact.textarea"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 text-sm tracking-widest transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: "rgba(212,175,55,0.15)",
                      border: "1px solid rgba(212,175,55,0.7)",
                      color: "#D4AF37",
                      borderRadius: "8px",
                      fontFamily: "'Cinzel Decorative', serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.15em",
                      animation: "goldPulse 3s ease-in-out infinite",
                    }}
                    data-ocid="contact.submit_button"
                  >
                    ✦ Send Sacred Inquiry ✦
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom lotus row */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-20">
          {["🪷", "✦", "🪷", "✦", "🪷"].map((s, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static decorative
              key={`l${i}`}
              style={{ color: "#D4AF37", fontSize: "1rem" }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER STRIP (inline on home)
      ═══════════════════════════════════════ */}
      <div
        className="py-8 text-center"
        style={{
          background: "#050810",
          borderTop: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <p
          className="text-xs"
          style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}
        >
          © {new Date().getFullYear()} Radhe Radhe Unique Collection · Rekha
          Khemka · Birgunj
        </p>
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs mt-2 inline-block"
          style={{ color: "rgba(245,240,232,0.3)" }}
        >
          Built with ♥ using caffeine.ai
        </a>
      </div>
    </div>
  );
}
