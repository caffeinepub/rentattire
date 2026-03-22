# Radhe Radhe Unique Collection

## Current State
Full-stack fashion rental e-commerce platform with:
- 3D mystical moonlit homepage (Three.js star fields, golden fireflies, parallax)
- Spiritual Radha-Krishna themed UI
- Admin-only sign-in (user sign-in removed)
- Product browsing, cart, checkout with Stripe
- Admin panel with CSV export, login tracking

## Requested Changes (Diff)

### Add
- Full homepage redesign: high-end 3D immersive spiritual experience
- New color palette: soft gold, royal blue, peacock green, lotus pink, warm sunlight + moonlight tones
- Hero section with the 5 uploaded Radha-Krishna photos used as parallax layers / hero imagery
- Three.js scene: floating petals reacting to mouse cursor, water ripple shader, light rays
- Parallax scrolling: foreground flowers, mid characters, background scenery
- Mouse movement = soft tilt + depth shift across all elements
- Continuous falling petals (CSS + Three.js particles)
- Diya/candle light flicker effect
- Glassmorphism cards with gold accents
- Glowing CTA button: "Enter Divine Experience"
- About section: love and devotion story
- Services section: 3D hover tilt cards with glow
- Gallery section: interactive zoom + depth using the 5 uploaded photos
- Booking/contact section with glassmorphic form
- Ambient flute music toggle button
- Smooth scroll storytelling
- Page entry transition (divine realm effect)
- Jewelry subtle shine CSS animation
- Fabric flowing animation

### Modify
- Replace all previous hero/gallery images with the 5 new uploads:
  - /assets/uploads/1.1-3.jpeg (Krishna painting Radha's feet)
  - /assets/uploads/1.2-4.jpeg (Krishna bowing at Radha's feet, temple pillar)
  - /assets/uploads/1.3-5.jpeg (Radha's feet with peacocks by riverside)
  - /assets/uploads/1.4-2.jpeg (Radha on swing, Krishna bowing)
  - /assets/uploads/1.5-1.jpeg (Krishna bowing at moonlit lake)
- Update color palette throughout
- Update all section content to be spiritually themed

### Remove
- Old moonlit dark navy homepage
- Old hero images

## Implementation Plan
1. Overhaul Home.tsx with Three.js Canvas: particle petals, light rays, water ripple plane
2. Implement parallax hero with the 5 images cycling as hero background
3. Add mouse-tracking tilt effect on hero and service cards
4. Build About, Services, Gallery, Contact sections with glassmorphism styling
5. Add ambient music toggle with flute audio
6. Add continuous falling petals overlay
7. Add diya flicker animation, jewelry shine effect
8. Apply new gold/blue/pink/peacock color palette via Tailwind + inline styles
9. Validate and build
