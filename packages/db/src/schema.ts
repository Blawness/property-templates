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
  index("listings_agent_id_idx").on(table.agentId),
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
  index("articles_author_id_idx").on(table.authorId),
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
  index("inquiries_listing_id_idx").on(table.listingId),
]);
