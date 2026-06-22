# Property Landing Page Templates — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 3 property landing page templates (Modern, Luxury, Classic) in a monorepo with shared admin-kit CMS, shared DB, and shared UI components.

**Architecture:** Turborepo monorepo with 3 layers: shared packages (`db`, `ui`), a CMS app (admin-kit), and 3 frontend apps. CMS writes to shared Neon Postgres via Drizzle; frontends read via cached queries. Media stored in Cloudflare R2.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, shadcn/ui, Drizzle ORM, postgres-js, `@blawness/admin-kit` 0.5.0, Turborepo, pnpm workspaces.

---

## File Structure

```
property-templates/
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── .gitignore
├── .env.example
├── packages/
│   ├── db/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts
│   │   └── src/
│   │       ├── index.ts              ← Drizzle client (lazy proxy)
│   │       ├── schema.ts             ← All tables + enums
│   │       ├── queries/
│   │       │   ├── listings.ts
│   │       │   ├── agents.ts
│   │       │   ├── testimonials.ts
│   │       │   ├── articles.ts
│   │       │   ├── inquiries.ts
│   │       │   └── settings.ts
│   │       └── seed.ts
│   └── ui/
│       ├── package.json
│       ├── tsconfig.json
│       ├── components.json
│       ├── postcss.config.mjs
│       └── src/
│           ├── index.ts
│           ├── types.ts
│           ├── lib/utils.ts
│           └── components/
│               ├── ui/               ← shadcn base
│               ├── property/         ← 10 property components
│               └── layout/           ← navbar + footer
├── apps/
│   ├── cms/                          ← admin-kit CMS
│   ├── modern/                       ← Modern template (port 3001)
│   ├── luxury/                       ← Luxury template (port 3002)
│   └── classic/                      ← Classic template (port 3003)
```

---

## Phase 1: Foundation

### Task 1: Monorepo Scaffolding

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`, `.env.example`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "property-templates",
  "private": true,
  "scripts": {
    "dev:cms": "turbo dev --filter=@property/cms",
    "dev:modern": "turbo dev --filter=@property/modern",
    "dev:luxury": "turbo dev --filter=@property/luxury",
    "dev:classic": "turbo dev --filter=@property/classic",
    "build": "turbo build",
    "lint": "turbo lint",
    "db:push": "turbo db:push --filter=@property/db",
    "db:generate": "turbo db:generate --filter=@property/db",
    "db:migrate": "turbo db:migrate --filter=@property/db",
    "db:seed": "turbo db:seed --filter=@property/db"
  },
  "devDependencies": {
    "turbo": "^2.5.0"
  },
  "packageManager": "pnpm@10.33.2",
  "pnpm": {
    "onlyBuiltDependencies": ["@blawness/admin-kit", "esbuild", "sharp"]
  }
}
```

- [ ] **Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

- [ ] **Step 3: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^build"] },
    "db:push": { "cache": false },
    "db:generate": { "cache": false },
    "db:migrate": { "cache": false },
    "db:seed": { "cache": false }
  }
}
```

- [ ] **Step 4: Create .gitignore**

```
node_modules/
.next/
dist/
.turbo/
.env
.env.local
*.tsbuildinfo
drizzle/
```

- [ ] **Step 5: Create .env.example**

```
DATABASE_URL=
AUTH_SECRET=
R2_BUCKET=
R2_PUBLIC_URL=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_ENDPOINT=
```

- [ ] **Step 6: Init git and install**

```bash
cd /home/blawness/projects/property-templates
git init
pnpm install
```

- [ ] **Step 7: Commit**

```bash
git add . && git commit -m "chore: scaffold turborepo monorepo"
```

---

### Task 2: Shared DB Package — Schema

**Files:**
- Create: `packages/db/package.json`
- Create: `packages/db/tsconfig.json`
- Create: `packages/db/drizzle.config.ts`
- Create: `packages/db/src/schema.ts`
- Create: `packages/db/src/index.ts`

- [ ] **Step 1: Create packages/db/package.json**

```json
{
  "name": "@property/db",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema.ts"
  },
  "scripts": {
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx src/seed.ts"
  },
  "dependencies": {
    "@blawness/admin-kit": "^0.5.0",
    "drizzle-orm": "^0.45.2",
    "postgres": "^3.4.5"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.0",
    "dotenv": "^16.5.0",
    "tsx": "^4.19.0",
    "typescript": "^5.8.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create drizzle.config.ts**

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

- [ ] **Step 4: Create src/schema.ts**

```ts
import {
  pgTable, serial, text, integer, boolean, timestamp,
  numeric, jsonb, pgEnum, index,
} from "drizzle-orm/pg-core";

export { users, media } from "@blawness/admin-kit/schema";
import { users } from "@blawness/admin-kit/schema";

export const templateEnum = pgEnum("template", ["modern", "luxury", "classic", "all"]);
export const listingTypeEnum = pgEnum("listing_type", ["sale", "rent"]);
export const categoryEnum = pgEnum("category", ["house", "apartment", "land", "commercial", "villa"]);
export const listingStatusEnum = pgEnum("listing_status", ["available", "sold", "rented", "draft"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["new", "read", "replied"]);
export const articleStatusEnum = pgEnum("article_status", ["published", "draft"]);

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photo: text("photo"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  bio: text("bio"),
  specializations: jsonb("specializations").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("IDR").notNull(),
  type: listingTypeEnum("type").notNull(),
  category: categoryEnum("category").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  landArea: integer("land_area"),
  buildingArea: integer("building_area"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  features: jsonb("features").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  virtualTourUrl: text("virtual_tour_url"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  status: listingStatusEnum("status").default("draft").notNull(),
  template: templateEnum("template").default("all").notNull(),
  agentId: integer("agent_id").references(() => agents.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("listings_status_idx").on(table.status),
  index("listings_template_idx").on(table.template),
  index("listings_city_idx").on(table.city),
  index("listings_slug_idx").on(table.slug),
]);

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientPhoto: text("client_photo"),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  template: templateEnum("template").default("all").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
  coverImage: text("cover_image"),
  excerpt: text("excerpt"),
  authorId: integer("author_id").references(() => users.id),
  template: templateEnum("template").default("all").notNull(),
  status: articleStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("articles_status_idx").on(table.status),
  index("articles_template_idx").on(table.template),
  index("articles_slug_idx").on(table.slug),
]);

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  template: text("template").notNull().unique(),
  siteName: text("site_name").notNull(),
  logoUrl: text("logo_url"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  heroImage: text("hero_image"),
  aboutContent: text("about_content"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  contactAddress: text("contact_address"),
  mapEmbedUrl: text("map_embed_url"),
  socialLinks: jsonb("social_links").$type<Record<string, string>>().default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  listingId: integer("listing_id").references(() => listings.id),
  template: text("template").notNull(),
  status: inquiryStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("inquiries_template_idx").on(table.template),
  index("inquiries_status_idx").on(table.status),
]);
```

- [ ] **Step 5: Create src/index.ts (lazy Drizzle client)**

```ts
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

let _db: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> {
  if (!_db) {
    const client = postgres(process.env.DATABASE_URL!, { prepare: false });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export { schema };
export * from "./schema.js";
```

- [ ] **Step 6: Install and push schema**

```bash
pnpm install && pnpm db:push
```

- [ ] **Step 7: Commit**

```bash
git add . && git commit -m "feat(db): add shared schema with all tables and enums"
```

---

### Task 3: Shared DB Package — Public Queries

**Files:**
- Create: `packages/db/src/queries/listings.ts`
- Create: `packages/db/src/queries/agents.ts`
- Create: `packages/db/src/queries/testimonials.ts`
- Create: `packages/db/src/queries/articles.ts`
- Create: `packages/db/src/queries/inquiries.ts`
- Create: `packages/db/src/queries/settings.ts`

- [ ] **Step 1: Create queries/listings.ts**

```ts
import { db } from "../index.js";
import { listings, agents } from "../schema.js";
import { eq, and, or, ilike, gte, lte, sql } from "drizzle-orm";

export async function getListings(filters: {
  template: string; status?: string; type?: string; category?: string;
  city?: string; minPrice?: number; maxPrice?: number; bedrooms?: number;
  search?: string; limit?: number; offset?: number;
}) {
  const conditions = [
    or(
      eq(listings.template, filters.template as any),
      eq(listings.template, "all")
    ),
    eq(listings.status, (filters.status ?? "available") as any),
  ];
  if (filters.type) conditions.push(eq(listings.type, filters.type as any));
  if (filters.category) conditions.push(eq(listings.category, filters.category as any));
  if (filters.city) conditions.push(ilike(listings.city, `%${filters.city}%`));
  if (filters.minPrice) conditions.push(gte(sql`${listings.price}::numeric`, filters.minPrice));
  if (filters.maxPrice) conditions.push(lte(sql`${listings.price}::numeric`, filters.maxPrice));
  if (filters.bedrooms) conditions.push(eq(listings.bedrooms, filters.bedrooms));
  if (filters.search) conditions.push(ilike(listings.title, `%${filters.search}%`));

  return db
    .select({
      id: listings.id, slug: listings.slug, title: listings.title,
      price: listings.price, type: listings.type, category: listings.category,
      city: listings.city, bedrooms: listings.bedrooms, bathrooms: listings.bathrooms,
      landArea: listings.landArea, buildingArea: listings.buildingArea,
      images: listings.images, isFeatured: listings.isFeatured, status: listings.status,
      agent: { id: agents.id, name: agents.name, photo: agents.photo },
    })
    .from(listings)
    .leftJoin(agents, eq(listings.agentId, agents.id))
    .where(and(...conditions))
    .orderBy(listings.isFeatured, listings.createdAt)
    .limit(filters.limit ?? 12)
    .offset(filters.offset ?? 0);
}

export async function getListingBySlug(slug: string, template: string) {
  const result = await db
    .select()
    .from(listings)
    .leftJoin(agents, eq(listings.agentId, agents.id))
    .where(and(
      eq(listings.slug, slug),
      or(eq(listings.template, template as any), eq(listings.template, "all"))
    ))
    .limit(1);
  return result[0] ?? null;
}

export async function getFeaturedListings(template: string, limit = 6) {
  return db
    .select()
    .from(listings)
    .leftJoin(agents, eq(listings.agentId, agents.id))
    .where(and(
      or(eq(listings.template, template as any), eq(listings.template, "all")),
      eq(listings.status, "available"),
      eq(listings.isFeatured, true)
    ))
    .orderBy(listings.createdAt)
    .limit(limit);
}

export async function getListingsByAgent(agentId: number, template: string) {
  return db.select().from(listings).where(and(
    eq(listings.agentId, agentId),
    or(eq(listings.template, template as any), eq(listings.template, "all")),
    eq(listings.status, "available")
  ));
}

export async function countListings(filters: {
  template: string; type?: string; category?: string; city?: string;
  minPrice?: number; maxPrice?: number; bedrooms?: number; search?: string;
}) {
  const conditions = [
    or(eq(listings.template, filters.template as any), eq(listings.template, "all")),
    eq(listings.status, "available" as const),
  ];
  if (filters.type) conditions.push(eq(listings.type, filters.type as any));
  if (filters.category) conditions.push(eq(listings.category, filters.category as any));
  if (filters.city) conditions.push(ilike(listings.city, `%${filters.city}%`));
  if (filters.minPrice) conditions.push(gte(sql`${listings.price}::numeric`, filters.minPrice));
  if (filters.maxPrice) conditions.push(lte(sql`${listings.price}::numeric`, filters.maxPrice));
  if (filters.bedrooms) conditions.push(eq(listings.bedrooms, filters.bedrooms));
  if (filters.search) conditions.push(ilike(listings.title, `%${filters.search}%`));

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(listings)
    .where(and(...conditions));
  return Number(result[0]?.count ?? 0);
}

export async function getCities(template: string) {
  const result = await db
    .selectDistinct({ city: listings.city })
    .from(listings)
    .where(and(
      or(eq(listings.template, template as any), eq(listings.template, "all")),
      eq(listings.status, "available")
    ))
    .orderBy(listings.city);
  return result.map((r) => r.city);
}
```

- [ ] **Step 2: Create queries/agents.ts**

```ts
import { db } from "../index.js";
import { agents } from "../schema.js";
import { eq } from "drizzle-orm";

export async function getActiveAgents() {
  return db.select().from(agents).where(eq(agents.isActive, true));
}

export async function getAgentById(id: number) {
  const result = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  return result[0] ?? null;
}
```

- [ ] **Step 3: Create queries/testimonials.ts**

```ts
import { db } from "../index.js";
import { testimonials } from "../schema.js";
import { and, eq, or } from "drizzle-orm";

export async function getActiveTestimonials(template: string) {
  return db.select().from(testimonials).where(and(
    or(eq(testimonials.template, template as any), eq(testimonials.template, "all")),
    eq(testimonials.isActive, true)
  )).orderBy(testimonials.rating);
}
```

- [ ] **Step 4: Create queries/articles.ts**

```ts
import { db } from "../index.js";
import { articles, users } from "../schema.js";
import { and, eq, or, desc } from "drizzle-orm";

export async function getPublishedArticles(template: string, limit = 12, offset = 0) {
  return db
    .select({
      id: articles.id, slug: articles.slug, title: articles.title,
      excerpt: articles.excerpt, coverImage: articles.coverImage,
      publishedAt: articles.publishedAt,
      author: { name: users.name },
    })
    .from(articles)
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(and(
      or(eq(articles.template, template as any), eq(articles.template, "all")),
      eq(articles.status, "published")
    ))
    .orderBy(desc(articles.publishedAt))
    .limit(limit).offset(offset);
}

export async function getArticleBySlug(slug: string, template: string) {
  const result = await db
    .select()
    .from(articles)
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(and(
      eq(articles.slug, slug),
      or(eq(articles.template, template as any), eq(articles.template, "all")),
      eq(articles.status, "published")
    ))
    .limit(1);
  return result[0] ?? null;
}
```

- [ ] **Step 5: Create queries/inquiries.ts**

```ts
import { db } from "../index.js";
import { inquiries } from "../schema.js";
import { eq, desc } from "drizzle-orm";

export async function createInquiry(data: {
  name: string; email: string; phone?: string;
  message: string; listingId?: number; template: string;
}) {
  return db.insert(inquiries).values(data).returning();
}

export async function getInquiries(template: string) {
  return db.select().from(inquiries)
    .where(eq(inquiries.template, template))
    .orderBy(desc(inquiries.createdAt));
}
```

- [ ] **Step 6: Create queries/settings.ts**

```ts
import { db } from "../index.js";
import { siteSettings } from "../schema.js";
import { eq } from "drizzle-orm";

export async function getSiteSettings(template: string) {
  const result = await db.select().from(siteSettings)
    .where(eq(siteSettings.template, template)).limit(1);
  return result[0] ?? null;
}

export async function upsertSiteSettings(
  template: string,
  data: Partial<typeof siteSettings.$inferInsert>
) {
  const existing = await getSiteSettings(template);
  if (existing) {
    return db.update(siteSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(siteSettings.template, template)).returning();
  }
  return db.insert(siteSettings).values({ ...data, template }).returning();
}
```

- [ ] **Step 7: Commit**

```bash
git add . && git commit -m "feat(db): add public query functions for all entities"
```

---

### Task 4: Shared DB Package — Seed Script

**Files:**
- Create: `packages/db/src/seed.ts`

- [ ] **Step 1: Create seed.ts**

```ts
import "dotenv/config";
import { db } from "./index.js";
import { agents, listings, testimonials, siteSettings } from "./schema.js";

async function seed() {
  console.log("Seeding database...");

  const [agent1] = await db.insert(agents).values([
    {
      name: "Budi Santoso", phone: "+6281234567890",
      email: "budi@property.com",
      bio: "<p>Agen properti berpengalaman 10+ tahun di Jabodetabek.</p>",
      specializations: ["Rumah", "Apartemen"], isActive: true,
    },
    {
      name: "Sari Dewi", phone: "+6281298765432",
      email: "sari@property.com",
      bio: "<p>Spesialis properti premium dan komersial.</p>",
      specializations: ["Villa", "Komersial"], isActive: true,
    },
  ]).returning();

  await db.insert(listings).values([
    {
      slug: "rumah-modern-bsd-city",
      title: "Rumah Modern Minimalis di BSD City",
      description: "<p>Rumah modern dengan desain minimalis, lokasi strategis.</p>",
      price: "2500000000", type: "sale", category: "house",
      bedrooms: 4, bathrooms: 3, landArea: 150, buildingArea: 200,
      address: "BSD City, Tangerang Selatan", city: "Tangerang", province: "Banten",
      features: ["Swimming Pool", "Carport", "Smart Home", "Garden"],
      images: [], isFeatured: true, status: "available", template: "all",
      agentId: agent1.id,
    },
    {
      slug: "apartemen-sudirman-park",
      title: "Apartemen Premium Sudirman Park",
      description: "<p>Apartemen full furnished di jantung kota Jakarta.</p>",
      price: "15000000", type: "rent", category: "apartment",
      bedrooms: 2, bathrooms: 1, buildingArea: 65,
      address: "Jl. KH. Mas Mansyur, Jakarta Pusat", city: "Jakarta", province: "DKI Jakarta",
      features: ["Furnished", "Gym", "Pool", "Concierge"],
      images: [], isFeatured: true, status: "available", template: "all",
      agentId: agent1.id,
    },
    {
      slug: "villa-ubud-bali",
      title: "Villa Mewah di Ubud Bali",
      description: "<p>Villa eksklusif dengan pemandangan sawah dan private pool.</p>",
      price: "8500000000", type: "sale", category: "villa",
      bedrooms: 5, bathrooms: 5, landArea: 500, buildingArea: 400,
      address: "Ubud, Gianyar", city: "Gianyar", province: "Bali",
      features: ["Private Pool", "Rice Field View", "Tropical Garden"],
      images: [], isFeatured: true, status: "available", template: "luxury",
      agentId: agent1.id,
    },
  ]);

  await db.insert(testimonials).values([
    {
      clientName: "Ahmad Rizki",
      content: "Proses pembelian rumah sangat mudah berkat tim yang profesional.",
      rating: 5, template: "all", isActive: true,
    },
    {
      clientName: "Linda Wijaya",
      content: "Apartemen yang kami sewa sesuai ekspektasi. Pelayanan memuaskan.",
      rating: 4, template: "all", isActive: true,
    },
  ]);

  await db.insert(siteSettings).values([
    {
      template: "modern", siteName: "Properti Modern",
      heroTitle: "Temukan Hunian Impian Anda",
      heroSubtitle: "Koleksi properti terbaik dengan desain modern dan lokasi strategis",
      contactPhone: "+6281234567890", contactEmail: "info@propertimodern.com",
      contactAddress: "Jl. Sudirman No. 1, Jakarta",
    },
    {
      template: "luxury", siteName: "Luxury Estates",
      heroTitle: "Exclusive Living, Redefined",
      heroSubtitle: "Curated collection of the finest properties",
      contactPhone: "+6281298765432", contactEmail: "concierge@luxuryestates.id",
      contactAddress: "Plaza Indonesia Level 5, Jakarta",
    },
    {
      template: "classic", siteName: "Griya Nusantara",
      heroTitle: "Rumah Keluarga, Kebahagiaan Anda",
      heroSubtitle: "Properti terpercaya untuk keluarga Indonesia sejak 2010",
      contactPhone: "+6281112223333", contactEmail: "halo@griyanusantara.id",
      contactAddress: "Jl. Gatot Subroto No. 10, Jakarta",
    },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
```

- [ ] **Step 2: Run seed**

```bash
pnpm db:seed
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat(db): add seed script with sample data"
```
