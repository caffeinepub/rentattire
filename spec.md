# Radhe Radhe Unique Collection — Mystical Moonlit UI Redesign

## Current State
The Home page has a daytime spiritual theme with soft greens, sky blues, pink palette, floating petals, sparkles, and a Krishna-Radha hero illustration. The page includes navbar, category pills, featured products grid, brand story, how-it-works, and newsletter sections.

## Requested Changes (Diff)

### Add
- Immersive dark night theme: deep navy blue (#0a0e1a) background replacing the current light gradient
- Large glowing full moon in the hero background using CSS/SVG radial glow effect
- Three.js canvas with floating particles, fireflies, and light ray effects layered over the scene
- Parallax depth layers: background (moon + stars), midground (Krishna-Radha silhouettes), foreground (tree leaves/branches)
- Mouse-move parallax tilt effect on the hero scene
- Framer Motion scroll-triggered animations on all sections
- Glassmorphism cards with gold border glow throughout
- Services section with 3 cards (Guidance, Love Reading, Healing) with CSS 3D hover tilt
- Interactive gallery section with glowing hover effects
- Contact/booking section with glassmorphic form
- Ambient flute music toggle button (floating, bottom-right)
- Soft fog/mist overlay effect using layered CSS gradients
- Firefly particles (small glowing dots with random float paths)
- Light rays emanating from the moon
- Cinematic vignette overlay

### Modify
- Hero background: replace light gradient with deep navy (#0a0e1a → #050810)
- Brand title: keep "Radhey Radhey Unique Collection" but change to soft gold/moon white color with glow
- CTA buttons: glassmorphism style with gold glow hover
- Navbar: deeper glassmorphism with gold accent border
- About/Brand Story section: dark themed with glassmorphic card layout
- How It Works: dark cards with gold number accents
- Color palette: deep navy blue, moon white (#f0f8ff), soft gold (#f9a825), subtle purple (#7c4dff)
- All text colors adjusted for dark background (moon white / soft gold)
- Hero image: use dark silhouette style against the glowing moon

### Remove
- Light daytime color gradients (greens, pinks, sky blues in section backgrounds)
- Floating petal animation (replaced by firefly particles)
- Shimmer water strip (replaced by moonlit fog effect)
- Newsletter section (replaced by contact/booking section)

## Implementation Plan
1. Update index.css: add dark theme CSS variables, keyframe animations for fireflies, fog drift, light rays, moon glow pulse, 3D card tilt
2. Install/use Three.js (already available via CDN-style import or npm) for particle canvas
3. Create MoonScene component: Three.js canvas with particle system (stars, fireflies, floating motes)
4. Create ParallaxHero component: layered divs with mouse-move transform, moon glow, fog layers, silhouette
5. Create ServiceCard component: 3D CSS tilt on hover using onMouseMove handler
6. Create GallerySection: grid with glowing hover border effect
7. Create ContactSection: glassmorphic booking form with gold accents
8. Create MusicToggle: floating button to toggle ambient flute audio
9. Rewrite Home.tsx to use dark theme sections with all new components
10. Keep all existing e-commerce functionality (products grid, categories, navigation)
