# Property Landing Page Templates - Design Spec

**Date:** 2026-06-18
**Author:** blawness
**Status:** Draft

---

## Overview

A monorepo containing 3 property landing page templates (Modern, Luxury, Classic) built with Next.js + Tailwind + shadcn/ui, powered by a shared admin-kit CMS. Designed as a portfolio showcase piece and reusable template pack.

---

## Architecture

### Monorepo Structure

```
property-templates/
├── turbo.json
├── package.json
├── packages/
│   ├── db/              ← Drizzle schema + queries
│   ├── ui/              ← shadcn components + property-specific components
│   └── cms/             ← admin-kit app (listings, agents, testimonials, media, users)
├── apps/
│   ├── modern/          ← Next.js frontend
│   ├── luxury/          ← Next.js frontend
│   └── classic/         ← Next.js frontend
```

### Data Flow

- CMS writes to shared DB via admin-kit + Drizzle
- Frontends read from shared DB via `unstable_cache` (tagged per-template)
- Media uploads via R2 (shared bucket, folder prefix per template)

### Deployment

- CMS: Vercel / VPS (needs server actions + R2 access)
- Frontends: Vercel (3 separate projects, one repo)
- DB: Neon Postgres (shared, branch per environment)
- Media: Cloudflare R2 (shared bucket, prefix: `modern/`, `luxury/`, `classic/`)

---

## Database Schema

```ts
// packages/db/schema.ts

// Re-export dari admin-kit
export { users, media } from "@blawness/admin-kit/schema";

// Listings
listings = {
  id, slug, title, description (Tiptap HTML),
  price, currency (default "IDR"),
  type: enum("sale", "rent"),
  category: enum("house", "apartment", "land", "commercial", "villa"),
  bedrooms, bathrooms, landArea, buildingArea,
  address, city, province, latitude, longitude,
  features: jsonb (string[] - pool, garage, etc),
  images: jsonb (string[] - R2 URLs),
  virtualTourUrl (nullable),
  isFeatured: boolean (default false),
  status: enum("available", "sold", "rented", "draft"),
  template: enum("modern", "luxury", "classic", "all"),
  agentId → agents.id,
  createdAt, updatedAt
}

// Agents
agents = {
  id, name, photo, phone, email,
  bio (Tiptap HTML),
  specializations: jsonb (string[]),
  isActive: boolean
}

// Testimonials
testimonials = {
  id, clientName, clientPhoto,
  content, rating (1-5),
  template: enum("modern", "luxury", "classic", "all"),
  isActive: boolean
}

// Blog (per-template)
articles = {
  id, slug, title, content (Tiptap HTML),
  coverImage, authorId → users.id,
  template: enum("modern", "luxury", "classic", "all"),
  status: enum("published", "draft"),
  publishedAt, createdAt, updatedAt
}

// Site settings (per-template config)
siteSettings = {
  id, template: enum("modern", "luxury", "classic"),
  siteName, logoUrl, heroTitle, heroSubtitle,
  heroImage, aboutContent (Tiptap HTML),
  contactPhone, contactEmail, contactAddress,
  mapEmbedUrl, socialLinks: jsonb
}

// Inquiries (contact form submissions)
inquiries = {
  id, name, email, phone, message,
  listingId → listings.id (nullable),
  template: enum("modern", "luxury", "classic"),
  status: enum("new", "read", "replied"),
  createdAt
}
```

### Key Decisions

- Field `template` di listings/testimonials/articles - bisa assign content ke satu atau semua template
- `siteSettings` per-template biar masing-masing punya branding sendiri dari CMS
- Frontend query filter by `template` + `status != "draft"`

---

## Shared Components & Features

### packages/ui/ Structure

```
packages/ui/
├── components/
│   ├── ui/           ← shadcn (Button, Card, Dialog, Input, Select, Badge, etc)
│   ├── property/
│   │   ├── ListingCard.tsx       ← card listing (image, price, specs, badge)
│   │   ├── ListingGrid.tsx       ← grid layout + responsive
│   │   ├── SearchFilter.tsx      ← filter: type, category, price range, bedrooms, city
│   │   ├── PropertyGallery.tsx   ← image gallery (lightbox)
│   │   ├── VirtualTourEmbed.tsx  ← iframe embed 360 tour
│   │   ├── MortgageCalculator.tsx← input: harga, DP, tenor, bunga → monthly payment
│   │   ├── AgentCard.tsx         ← agent profile card
│   │   ├── TestimonialCard.tsx   ← testimonial with rating stars
│   │   ├── ContactForm.tsx       ← form: name, email, phone, message → action
│   │   └── MapEmbed.tsx          ← Google Maps embed via siteSettings
│   └── layout/
│       ├── Navbar.tsx            ← base navbar (styled per template)
│       └── Footer.tsx            ← base footer
```

### Key Decisions

- Components render data, styling di-override per template via className props / CVA variants
- `SearchFilter` client component, filter state via URL searchParams (SEO friendly)
- `MortgageCalculator` pure client-side, no API call
- `ContactForm` submit ke server action → simpan inquiry ke DB (bisa ditambah email notification belakangan)

### Pages & Features

| Halaman | Fitur |
|---------|-------|
| `/` | Hero, featured listings, testimonials, CTA |
| `/listings` | SearchFilter + ListingGrid, pagination |
| `/listings/[slug]` | Gallery, specs, virtual tour, mortgage calc, agent card, contact form |
| `/agents/[id]` | Agent profile + their listings |
| `/about` | About content from siteSettings, map |
| `/blog` | Article grid |
| `/blog/[slug]` | Article content (Tiptap HTML) |
| `/contact` | Contact form + map + info |

---

## Template Styles - Visual Identity

### Modern

- **Vibe:** Clean, spacious, tech-forward
- **Typography:** Sans-serif bold (Inter / Plus Jakarta Sans)
- **Color:** White base, blue accent, subtle grays
- **Layout:** Full-width hero, asymmetric grids, lots of whitespace
- **Details:** Rounded corners, soft shadows, smooth animations, glassmorphism navbar

### Luxury

- **Vibe:** Premium, exclusive, cinematic
- **Typography:** Serif display (Playfair Display) + sans-serif body (Inter)
- **Color:** Dark base (#0a0a0a), gold accent (#d4a853), cream text
- **Layout:** Full-bleed imagery, parallax scroll, dramatic hero video/image
- **Details:** Sharp corners, gold borders, letter-spacing, fade-in animations

### Classic

- **Vibe:** Warm, trustworthy, traditional
- **Typography:** Serif (Lora / Merriweather) + sans-serif body
- **Color:** Warm whites, navy/forest green accent, earth tones
- **Layout:** Centered content, traditional grid, sidebar layouts
- **Details:** Decorative dividers, subtle textures, classic card borders

### Tailwind v4 Theme Tokens

```css
/* apps/modern/globals.css */
@theme {
  --color-primary: #2563eb;
  --color-accent: #3b82f6;
  --font-display: "Plus Jakarta Sans";
  --radius-card: 1rem;
}

/* apps/luxury/globals.css */
@theme {
  --color-primary: #d4a853;
  --color-accent: #c9a84c;
  --font-display: "Playfair Display";
  --radius-card: 0;
}

/* apps/classic/globals.css */
@theme {
  --color-primary: #1e3a5f;
  --color-accent: #2d5a87;
  --font-display: "Lora";
  --radius-card: 0.5rem;
}
```

Tiap template import shared components tapi styling otomatis adapt via CSS variables.

---

## Error Handling, Testing & Deployment

### Error Handling

- `notFound()` buat listing/agent/article yang gak ada atau draft
- `try/catch` di semua server actions, return user-friendly message via `ToastOnParam`
- Empty state components buat search tanpa hasil
- `loading.tsx` + Suspense boundaries di tiap route

### Testing

- Vitest unit tests buat `MortgageCalculator`, `SearchFilter` logic, `slugify`
- Playwright E2E: browse listings → filter → detail → contact form submit
- Focus testing di shared packages (`db`, `ui`), bukan per-template

### Environment Variables

**Per frontend app:**
```
DATABASE_URL=        # Neon pooled
NEXT_PUBLIC_SITE_URL=
```

**CMS (admin-kit):**
```
DATABASE_URL=        # Neon pooled
AUTH_SECRET=
R2_BUCKET=
R2_PUBLIC_URL=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
```

### Monorepo Commands

```bash
pnpm dev:cms         # run CMS
pnpm dev:modern      # run modern frontend
pnpm dev:luxury      # run luxury frontend
pnpm dev:classic     # run classic frontend
pnpm db:push         # push schema ke DB
pnpm db:seed         # seed sample data
```

---

## Success Criteria

1. 3 landing page templates with distinct visual identities
2. Shared CMS untuk manage semua content
3. Full-featured: search, filter, gallery, virtual tour, mortgage calculator, contact form
4. Deployable independently per template
5. Portfolio-ready showcase
