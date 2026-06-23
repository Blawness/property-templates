import { dummyListings, dummyAgents, dummyTestimonials, dummySiteSettings } from "@property/db/dummy";

const TEMPLATE = "modern" as const;
const HAS_DB = !!(process.env.DATABASE_URL);

function matchTemplate(items: any[]) {
  return items.filter((i) => i.template === TEMPLATE || i.template === "all");
}

// Dynamic imports for DB queries — only import when DATABASE_URL is set
async function getDBQueries() {
  if (!HAS_DB) return null;
  const mod = await import("@property/db/queries/listings");
  return mod;
}

async function getDBQueriesAgents() {
  if (!HAS_DB) return null;
  return await import("@property/db/queries/agents");
}

async function getDBQueriesTestimonials() {
  if (!HAS_DB) return null;
  return await import("@property/db/queries/testimonials");
}

async function getDBQueriesArticles() {
  if (!HAS_DB) return null;
  return await import("@property/db/queries/articles");
}

async function getDBQueriesSettings() {
  if (!HAS_DB) return null;
  return await import("@property/db/queries/settings");
}

export async function fetchFeaturedListings() {
  const q = await getDBQueries();
  if (q) return q.getFeaturedListings(TEMPLATE);
  return dummyListings.filter((l) => l.isFeatured && l.status === "available" && (l.template === TEMPLATE || l.template === "all"));
}

export async function fetchListings(filters: any) {
  const q = await getDBQueries();
  if (q) return q.getListings({ ...filters, template: TEMPLATE });
  let items = [...dummyListings].filter((l) => l.status === "available" && (l.template === TEMPLATE || l.template === "all"));
  if (filters.type) items = items.filter((l) => l.type === filters.type);
  if (filters.category) items = items.filter((l) => l.category === filters.category);
  if (filters.city) items = items.filter((l) => l.city.toLowerCase().includes(filters.city.toLowerCase()));
  if (filters.search) items = items.filter((l) => l.title.toLowerCase().includes(filters.search.toLowerCase()));
  return items.slice(filters.offset || 0, (filters.offset || 0) + (filters.limit || 9));
}

export function fetchListingBySlug(slug: string) {
  if (HAS_DB) {
    return import("@property/db/queries/listings").then((q) => q.getListingBySlug(slug, TEMPLATE));
  }
  const listing = dummyListings.find((l) => l.slug === slug && (l.template === TEMPLATE || l.template === "all"));
  if (!listing) return Promise.resolve(null);
  const agent = dummyAgents.find((a) => a.id === listing.agentId) || null;
  return Promise.resolve({ ...listing, agent });
}

export async function fetchCities() {
  const q = await getDBQueries();
  if (q) return q.getCities(TEMPLATE);
  return [...new Set(matchTemplate(dummyListings).map((l) => l.city))].sort();
}

export async function fetchListingsCount(filters: any) {
  const listings = await fetchListings({ ...filters, limit: 1000, offset: 0 });
  return listings.length;
}

export async function fetchAgents() {
  const q = await getDBQueriesAgents();
  if (q) return q.getActiveAgents();
  return dummyAgents.filter((a) => a.isActive);
}

export async function fetchAgentById(id: number) {
  const q = await getDBQueriesAgents();
  if (q) return q.getAgentById(id);
  return dummyAgents.find((a) => a.id === id) || null;
}

export async function fetchTestimonials() {
  const q = await getDBQueriesTestimonials();
  if (q) return q.getActiveTestimonials(TEMPLATE);
  return matchTemplate(dummyTestimonials).filter((t: any) => t.isActive);
}

export async function fetchArticles(limit?: number, offset?: number) {
  const q = await getDBQueriesArticles();
  if (q) return q.getPublishedArticles(TEMPLATE, limit, offset);
  const articles = matchTemplate(dummyTestimonials); // no dummy articles, return empty
  return articles.slice(offset || 0, (offset || 0) + (limit || 12));
}

export async function fetchArticleBySlug(slug: string) {
  return null; // no dummy articles
}

export async function fetchListingsByAgent(agentId: number) {
  const q = await getDBQueries();
  if (q) return q.getListingsByAgent(agentId, TEMPLATE);
  return dummyListings.filter((l) => l.agentId === agentId && (l.template === TEMPLATE || l.template === "all") && l.status === "available");
}

export async function fetchSettings() {
  const q = await getDBQueriesSettings();
  if (q) return q.getSiteSettings(TEMPLATE);
  return dummySiteSettings[TEMPLATE] || null;
}
