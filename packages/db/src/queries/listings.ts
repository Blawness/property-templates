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
