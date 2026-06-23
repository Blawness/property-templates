import { unstable_cache } from "next/cache";
import {
  getFeaturedListings, getListings, getListingBySlug, getCities, countListings,
} from "@property/db/queries/listings";
import { getActiveAgents, getAgentById } from "@property/db/queries/agents";
import { getActiveTestimonials } from "@property/db/queries/testimonials";
import { getPublishedArticles, getArticleBySlug } from "@property/db/queries/articles";
import { getSiteSettings } from "@property/db/queries/settings";

const TEMPLATE = "luxury";

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
