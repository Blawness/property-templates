# Frontend Apps — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 3 Next.js frontend apps (modern on port 3001, luxury on 3002, classic on 3003) — each with distinct visual themes, shared components from @property/ui, and data from @property/db.

**Architecture:** Each app is a standalone Next.js app with its own Tailwind theme. Pages are almost identical in structure — only CSS variables and font choices differ. All data fetching uses @property/db public queries filtered by template name. Components come from @property/ui. Inquiries submit to server actions mapping to @property/db query functions.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, @property/db, @property/ui, next/font

---

## File Structure (per app, using modern as example)

```
apps/modern/
├── package.json
├── next.config.mjs
├── tsconfig.json
├── app/
│   ├── globals.css          ← theme tokens + fonts
│   ├── layout.tsx            ← metadata + Navbar + Footer
│   ├── page.tsx              ← home: hero + featured + testimonials
│   ├── listings/
│   │   ├── page.tsx          ← SearchFilter + ListingGrid + pagination
│   │   └── [slug]/
│   │       └── page.tsx      ← Gallery + specs + agent + mortgage + contact
│   ├── agents/
│   │   └── [id]/
│   │       └── page.tsx      ← AgentCard + their listings
│   ├── about/
│   │   └── page.tsx          ← About content + map
│   ├── blog/
│   │   ├── page.tsx          ← Article grid
│   │   └── [slug]/
│   │       └── page.tsx      ← Article content
│   └── contact/
│       └── page.tsx          ← ContactForm + map + info
├── lib/
│   └── data.ts               ← cached data fetching wrappers
└── actions.ts                ← server action for contact form
```

---

### Task 1: Modern Template — Scaffolding + Home Page

**Files:**
- Create: `apps/modern/package.json`, `next.config.mjs`, `tsconfig.json`
- Create: `apps/modern/app/globals.css`, `layout.tsx`, `page.tsx`
- Create: `apps/modern/lib/data.ts`, `apps/modern/actions.ts`

- [ ] **Step 1: Create apps/modern/package.json**

```json
{
  "name": "@property/modern",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "lint": "next lint"
  },
  "dependencies": {
    "@property/db": "workspace:*",
    "@property/ui": "workspace:*",
    "next": "^16.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "lucide-react": "^0.511.0"
  },
  "devDependencies": {
    "@types/node": "^22.19.0",
    "@types/react": "^19.2.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.8.0"
  }
}
```

- [ ] **Step 2: Create apps/modern/next.config.mjs**

```js
const nextConfig = {
  transpilePackages: ["@property/ui"],
};

export default nextConfig;
```

- [ ] **Step 3: Create apps/modern/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

- [ ] **Step 4: Create apps/modern/app/globals.css (Modern theme)**

```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

@theme {
  --color-primary: #2563eb;
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.96 0.01 260);
  --color-secondary-foreground: oklch(0.2 0.02 260);
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.15 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.15 0 0);
  --color-muted: oklch(0.96 0 0);
  --color-muted-foreground: oklch(0.55 0.02 260);
  --color-border: oklch(0.9 0 0);
  --color-input: oklch(0.9 0 0);
  --color-accent: oklch(0.97 0.01 260);
  --color-accent-foreground: oklch(0.2 0.02 260);
  --color-destructive: oklch(0.55 0.2 25);
  --color-destructive-foreground: oklch(0.98 0 0);
  --color-ring: oklch(0.5 0.2 260);
  --font-sans: "Plus Jakarta Sans", sans-serif;
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
}
```

- [ ] **Step 5: Create apps/modern/lib/data.ts (cached data layer)**

```ts
import { unstable_cache } from "next/cache";
import {
  getFeaturedListings, getListings, getListingBySlug, getCities, countListings,
} from "@property/db/queries/listings";
import { getActiveAgents, getAgentById } from "@property/db/queries/agents";
import { getActiveTestimonials } from "@property/db/queries/testimonials";
import { getPublishedArticles, getArticleBySlug } from "@property/db/queries/articles";
import { getSiteSettings } from "@property/db/queries/settings";

const TEMPLATE = "modern";

export const fetchFeaturedListings = unstable_cache(
  () => getFeaturedListings(TEMPLATE),
  [`${TEMPLATE}-featured-listings`],
  { tags: ["listings"], revalidate: 300 }
);

export const fetchListings = unstable_cache(
  (filters: Parameters<typeof getListings>[0]) => getListings({ ...filters, template: TEMPLATE }),
  [`${TEMPLATE}-listings`],
  { tags: ["listings"], revalidate: 60 }
);

export const fetchListingBySlug = (slug: string) => getListingBySlug(slug, TEMPLATE);
export const fetchCities = unstable_cache(() => getCities(TEMPLATE), [`${TEMPLATE}-cities`], { tags: ["listings"], revalidate: 3600 });
export const fetchListingsCount = unstable_cache((filters: Parameters<typeof countListings>[0]) => countListings({ ...filters, template: TEMPLATE }), [`${TEMPLATE}-listings-count`], { tags: ["listings"], revalidate: 60 });

export const fetchAgents = unstable_cache(() => getActiveAgents(), [`${TEMPLATE}-agents`], { tags: ["agents"], revalidate: 3600 });
export const fetchAgentById = (id: number) => getAgentById(id);

export const fetchTestimonials = unstable_cache(() => getActiveTestimonials(TEMPLATE), [`${TEMPLATE}-testimonials`], { tags: ["testimonials"], revalidate: 3600 });

export const fetchArticles = unstable_cache((limit?: number, offset?: number) => getPublishedArticles(TEMPLATE, limit, offset), [`${TEMPLATE}-articles`], { tags: ["articles"], revalidate: 300 });
export const fetchArticleBySlug = (slug: string) => getArticleBySlug(slug, TEMPLATE);

export const fetchSettings = unstable_cache(() => getSiteSettings(TEMPLATE), [`${TEMPLATE}-settings`], { tags: ["settings"], revalidate: 3600 });
```

- [ ] **Step 6: Create apps/modern/actions.ts**

```ts
"use server";

import { createInquiry } from "@property/db/queries/inquiries";
import { revalidateTag } from "next/cache";

export async function submitInquiry(formData: FormData) {
  try {
    await createInquiry({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      message: formData.get("message") as string,
      listingId: formData.get("listingId") ? Number(formData.get("listingId")) : undefined,
      template: formData.get("template") as string,
    });
    revalidateTag("inquiries");
    return { success: true, message: "Pesan berhasil dikirim. Kami akan menghubungi Anda segera." };
  } catch {
    return { success: false, message: "Gagal mengirim pesan. Silakan coba lagi." };
  }
}
```

- [ ] **Step 7: Create apps/modern/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { fetchSettings } from "@/lib/data";
import { Navbar, Footer } from "@property/ui";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Properti Modern", template: "%s | Properti Modern" },
  description: "Temukan hunian impian Anda di Properti Modern.",
};

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/listings" },
  { label: "Blog", href: "/blog" },
  { label: "Tentang", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettings();

  return (
    <html lang="id" className={font.className}>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <Navbar
          siteName={settings?.siteName ?? "Properti Modern"}
          logoUrl={settings?.logoUrl}
          links={navLinks}
        />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={settings?.siteName ?? "Properti Modern"}
          links={navLinks}
          contactPhone={settings?.contactPhone}
          contactEmail={settings?.contactEmail}
          contactAddress={settings?.contactAddress}
          socialLinks={settings?.socialLinks ?? {}}
        />
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Create apps/modern/app/page.tsx (Home page)**

```tsx
import Link from "next/link";
import { fetchFeaturedListings, fetchTestimonials, fetchSettings } from "@/lib/data";
import { ListingCard, TestimonialCard, Button, Skeleton } from "@property/ui";
import { Search, ArrowRight } from "lucide-react";
import { Suspense } from "react";

async function FeaturedListings() {
  const listings = await fetchFeaturedListings();
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l: any) => (
        <ListingCard key={l.listings?.id ?? l.id} listing={l.listings ?? l} basePath="" />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const [settings, testimonials] = await Promise.all([fetchSettings(), fetchTestimonials()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 py-24">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {settings?.heroTitle ?? "Temukan Hunian Impian Anda"}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            {settings?.heroSubtitle ?? "Koleksi properti terbaik dengan desain modern dan lokasi strategis"}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/listings"><Search className="size-4" /> Cari Properti</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Tentang Kami <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Properti Unggulan</h2>
            <p className="text-muted-foreground text-sm">Pilihan properti terbaik untuk Anda.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/listings">Lihat Semua <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
        <Suspense fallback={<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:3}).map((_,i)=>(<Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />))}</div>}>
          <FeaturedListings />
        </Suspense>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">Testimoni Klien</h2>
              <p className="text-muted-foreground text-sm">Apa kata mereka tentang kami.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((t: any) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold">Butuh Bantuan?</h2>
          <p className="text-muted-foreground mt-2">Hubungi tim kami untuk konsultasi properti gratis.</p>
          <Button asChild className="mt-6">
            <Link href="/contact">Hubungi Kami</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 9: Install and commit**

```bash
pnpm install && git add . && git commit -m "feat(modern): scaffold modern template with home page"
```

---

### Task 2: Modern Template — Listings Pages

**Files:**
- Create: `apps/modern/app/listings/page.tsx`
- Create: `apps/modern/app/listings/[slug]/page.tsx`

- [ ] **Step 1: Create list page with filter + pagination**

```tsx
import { Suspense } from "react";
import { fetchListings, fetchCities, fetchListingsCount } from "@/lib/data";
import { ListingGrid, SearchFilter, Skeleton } from "@property/ui";
import { Pagination, type SearchParams } from "@/components/pagination";

export const metadata = { title: "Daftar Properti" };

export default async function ListingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters = {
    type: params.type,
    category: params.category,
    city: params.city,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    search: params.search,
  };
  const page = Number(params.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  const [listings, cities, total] = await Promise.all([
    fetchListings({ ...filters, limit, offset }),
    fetchCities(),
    fetchListingsCount(filters),
  ]);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Daftar Properti</h1>
        <p className="text-muted-foreground text-sm">Temukan properti sesuai kebutuhan Anda.</p>
      </div>
      <SearchFilter cities={cities} />
      <div className="mt-6">
        <Suspense fallback={<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=>(<Skeleton key={i} className="aspect-[4/3] rounded-xl" />))}</div>}>
          <ListingGrid listings={listings as any} />
        </Suspense>
      </div>
      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
    </div>
  );
}
```

- [ ] **Step 2: Create listing detail page**

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchListingBySlug } from "@/lib/data";
import { PropertyGallery, AgentCard, MortgageCalculator, ContactForm, VirtualTourEmbed, Badge } from "@property/ui";
import { formatPrice } from "@property/ui";
import { Bed, Bath, Maximize, MapPin, Check } from "lucide-react";
import { submitInquiry } from "@/actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await fetchListingBySlug(slug);
  return { title: row?.listings?.title ?? "Properti Tidak Ditemukan" };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row: any = await fetchListingBySlug(slug);
  if (!row) notFound();

  const listing = row.listings ?? row;
  const agent = row.agents ?? listing.agent;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PropertyGallery images={listing.images as string[]} title={listing.title} className="mb-8" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge>{listing.type === "sale" ? "Dijual" : "Disewa"}</Badge>
              <Badge variant="outline" className="capitalize">{listing.category}</Badge>
              <Badge variant="secondary" className="capitalize">{listing.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="size-4" /> {listing.address}, {listing.city}
            </p>
            <p className="text-3xl font-bold text-primary mt-4">{formatPrice(String(listing.price))}</p>
          </div>

          <div className="flex gap-6 text-sm">
            {listing.bedrooms != null && <span className="flex items-center gap-1"><Bed className="size-4" /> {listing.bedrooms} Kamar Tidur</span>}
            {listing.bathrooms != null && <span className="flex items-center gap-1"><Bath className="size-4" /> {listing.bathrooms} Kamar Mandi</span>}
            {listing.landArea != null && <span className="flex items-center gap-1"><Maximize className="size-4" /> {listing.landArea} m² Tanah</span>}
            {listing.buildingArea != null && <span className="flex items-center gap-1"><Maximize className="size-4" /> {listing.buildingArea} m² Bangunan</span>}
          </div>

          {listing.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
              <div className="text-muted-foreground prose prose-sm" dangerouslySetInnerHTML={{ __html: listing.description }} />
            </div>
          )}

          {listing.features?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Fasilitas</h2>
              <div className="grid grid-cols-2 gap-2">
                {(listing.features as string[]).map((f) => (
                  <span key={f} className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary" /> {f}</span>
                ))}
              </div>
            </div>
          )}

          {listing.virtualTourUrl && <VirtualTourEmbed url={listing.virtualTourUrl} />}
        </div>

        <div className="space-y-6">
          {agent && <AgentCard agent={{ ...agent, photo: agent.photo ?? null }} showContact />}
          <ContactForm action={submitInquiry} listingId={listing.id} template="modern" />
          <MortgageCalculator propertyPrice={String(listing.price)} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create pagination component at apps/modern/components/pagination.tsx**

```tsx
import Link from "next/link";
import { Button } from "@property/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SearchParams = Record<string, string | undefined>;

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const createUrl = (page: number) => `/listings?page=${page}`;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      {currentPage > 1 && (
        <Button variant="outline" size="sm" asChild>
          <Link href={createUrl(currentPage - 1)}><ChevronLeft className="size-4" /> Prev</Link>
        </Button>
      )}
      <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages && (
        <Button variant="outline" size="sm" asChild>
          <Link href={createUrl(currentPage + 1)}>Next <ChevronRight className="size-4" /></Link>
        </Button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(modern): add listing list and detail pages"
```

---

### Task 3: Modern Template — Agents, About, Blog, Contact Pages

**Files:**
- Create: `apps/modern/app/agents/[id]/page.tsx`
- Create: `apps/modern/app/about/page.tsx`
- Create: `apps/modern/app/blog/page.tsx`
- Create: `apps/modern/app/blog/[slug]/page.tsx`
- Create: `apps/modern/app/contact/page.tsx`

- [ ] **Step 1: Agents detail page**

```tsx
import { notFound } from "next/navigation";
import { fetchAgentById } from "@/lib/data";
import { getListingsByAgent } from "@property/db/queries/listings";
import { AgentCard, ListingGrid, Badge } from "@property/ui";
import { Phone, Mail, MapPin } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await fetchAgentById(Number(id));
  return { title: agent?.name ?? "Agent Not Found" };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await fetchAgentById(Number(id));
  if (!agent) notFound();

  const agentListings = await getListingsByAgent(agent.id, "modern");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto mb-12">
        <AgentCard agent={agent} showContact />
        {agent.bio && (
          <div className="mt-6 text-muted-foreground" dangerouslySetInnerHTML={{ __html: agent.bio }} />
        )}
      </div>
      {agentListings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Properti oleh {agent.name}</h2>
          <ListingGrid listings={agentListings as any} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: About page**

```tsx
import { fetchSettings } from "@/lib/data";
import { MapEmbed } from "@property/ui";

export const metadata = { title: "Tentang Kami" };

export default async function AboutPage() {
  const settings = await fetchSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tentang {settings?.siteName ?? "Kami"}</h1>
        {settings?.aboutContent ? (
          <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: settings.aboutContent }} />
        ) : (
          <p className="text-muted-foreground">Konten tentang kami akan segera tersedia.</p>
        )}
      </div>
      {settings?.mapEmbedUrl && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Lokasi Kami</h2>
          <MapEmbed embedUrl={settings.mapEmbedUrl} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Blog list page**

```tsx
import Link from "next/link";
import Image from "next/image";
import { fetchArticles } from "@/lib/data";
import { Card, CardContent } from "@property/ui";
import { Calendar } from "lucide-react";

export const metadata = { title: "Blog" };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 6;
  const articles = await fetchArticles(limit, (page - 1) * limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground text-sm mb-8">Artikel terbaru seputar properti.</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article: any) => (
          <Link key={article.id} href={`/blog/${article.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                {article.coverImage ? (
                  <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="(max-width:640px)100vw,33vw" />
                ) : (
                  <div className="bg-muted flex h-full w-full items-center justify-center text-muted-foreground">No Image</div>
                )}
              </div>
              <CardContent className="space-y-2 pt-4">
                <h2 className="font-semibold line-clamp-2">{article.title}</h2>
                {article.excerpt && <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>}
                {article.publishedAt && (
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(article.publishedAt).toLocaleDateString("id-ID")}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {articles.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">Belum ada artikel.</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Blog detail page**

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchArticleBySlug } from "@/lib/data";
import { Calendar, User } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await fetchArticleBySlug(slug);
  return { title: row?.articles?.title ?? row?.title ?? "Article" };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row: any = await fetchArticleBySlug(slug);
  if (!row) notFound();

  const article = row.articles ?? row;
  const author = row.users ?? row.author;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {article.coverImage && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="(max-width:768px)100vw,66vw" priority />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8">
        {author?.name && <span className="flex items-center gap-1"><User className="size-4" /> {author.name}</span>}
        {article.publishedAt && <span className="flex items-center gap-1"><Calendar className="size-4" /> {new Date(article.publishedAt).toLocaleDateString("id-ID")}</span>}
      </div>
      {article.content ? (
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      ) : (
        <p className="text-muted-foreground">Konten belum tersedia.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Contact page**

```tsx
import { fetchSettings } from "@/lib/data";
import { ContactForm, MapEmbed } from "@property/ui";
import { submitInquiry } from "@/actions";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata = { title: "Kontak" };

export default async function ContactPage() {
  const settings = await fetchSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8">Hubungi Kami</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <ContactForm action={submitInquiry} template="modern" />
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            {settings?.contactPhone && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3"><Phone className="size-5 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">Telepon</p><p className="font-medium">{settings.contactPhone}</p></div>
              </div>
            )}
            {settings?.contactEmail && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3"><Mail className="size-5 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{settings.contactEmail}</p></div>
              </div>
            )}
            {settings?.contactAddress && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3"><MapPin className="size-5 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">Alamat</p><p className="font-medium">{settings.contactAddress}</p></div>
              </div>
            )}
          </div>
          {settings?.mapEmbedUrl && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Lokasi</h2>
              <MapEmbed embedUrl={settings.mapEmbedUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat(modern): add agent detail, about, blog, and contact pages"
```

---

### Task 4: Luxury Template (port 3002)

**Files:** Same as modern but with luxury theme. Create 14 files under `apps/luxury/`.

Key differences from modern:
- **globals.css:** `--color-primary: #d4a853`, `--color-background: oklch(0.12 0 0)` (dark base), gold accent, Playfair Display font
- **layout.tsx:** Import Playfair_Display font, site name "Luxury Estates"
- **lib/data.ts:** TEMPLATE = "luxury"
- **package.json:** @property/luxury, port 3002
- All pages identical code, just copy from modern — only template string changes to "luxury"

- [ ] **Step 1: Create all luxury files (globals.css theme)**

```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap");

@theme {
  --color-primary: #d4a853;
  --color-primary-foreground: oklch(0.1 0 0);
  --color-secondary: oklch(0.2 0 0);
  --color-secondary-foreground: oklch(0.9 0 0);
  --color-background: oklch(0.12 0 0);
  --color-foreground: oklch(0.9 0 0);
  --color-card: oklch(0.16 0 0);
  --color-card-foreground: oklch(0.9 0 0);
  --color-muted: oklch(0.2 0 0);
  --color-muted-foreground: oklch(0.6 0.02 80);
  --color-border: oklch(0.25 0 0);
  --color-input: oklch(0.25 0 0);
  --color-accent: oklch(0.22 0.02 80);
  --color-accent-foreground: oklch(0.9 0 0);
  --color-destructive: oklch(0.45 0.15 25);
  --color-destructive-foreground: oklch(0.98 0 0);
  --color-ring: oklch(0.7 0.1 80);
  --font-sans: "Inter", sans-serif;
  --font-serif: "Playfair Display", serif;
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
}
```

- [ ] **Step 2-14: Copy all pages from modern, changing TEMPLATE to "luxury", font to Playfair_Display + Inter, site name to "Luxury Estates", port to 3002**

- [ ] **Commit**

```bash
git add . && git commit -m "feat(luxury): add luxury template with dark/gold theme"
```

---

### Task 5: Classic Template (port 3003)

**Files:** Same structure, 14 files under `apps/classic/`.

Key differences:
- **globals.css:** `--color-primary: #1e3a5f` (navy), warm white base, Lora font, earth tones
- **layout.tsx:** Lora font, site name "Griya Nusantara"
- **lib/data.ts:** TEMPLATE = "classic"
- **package.json:** @property/classic, port 3003

- [ ] **Step 1: Create classic globals.css theme**

```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap");

@theme {
  --color-primary: #1e3a5f;
  --color-primary-foreground: oklch(0.98 0 0);
  --color-secondary: oklch(0.92 0.02 120);
  --color-secondary-foreground: oklch(0.15 0.02 120);
  --color-background: oklch(0.985 0.005 90);
  --color-foreground: oklch(0.15 0.02 260);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.15 0.02 260);
  --color-muted: oklch(0.96 0.005 90);
  --color-muted-foreground: oklch(0.5 0.01 120);
  --color-border: oklch(0.85 0.005 90);
  --color-input: oklch(0.85 0.005 90);
  --color-accent: oklch(0.94 0.02 100);
  --color-accent-foreground: oklch(0.15 0.02 260);
  --color-destructive: oklch(0.45 0.15 25);
  --color-destructive-foreground: oklch(0.98 0 0);
  --color-ring: oklch(0.3 0.05 260);
  --font-sans: "Inter", sans-serif;
  --font-serif: "Lora", serif;
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

- [ ] **Step 2-14: Copy all pages from modern, changing TEMPLATE to "classic", font to Lora + Inter, site name to "Griya Nusantara", port to 3003**

- [ ] **Commit**

```bash
git add . && git commit -m "feat(classic): add classic template with warm/navy theme"
```

---

### Task 6: Final verification — pnpm install + push

- [ ] **Step 1: Install all dependencies**

```bash
pnpm install
```

- [ ] **Step 2: Push to GitHub**

```bash
git push
```
