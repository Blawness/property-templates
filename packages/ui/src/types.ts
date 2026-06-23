export interface Listing {
  id: number;
  slug: string;
  title: string;
  price: string;
  type: "sale" | "rent";
  category: "house" | "apartment" | "land" | "commercial" | "villa";
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  landArea: number | null;
  buildingArea: number | null;
  images: string[];
  isFeatured: boolean;
  status: "available" | "sold" | "rented" | "draft";
  agent?: {
    id: number;
    name: string;
    photo: string | null;
  } | null;
}

export interface ListingDetail extends Listing {
  description: string | null;
  currency: string;
  address: string;
  province: string | null;
  latitude: string | null;
  longitude: string | null;
  features: string[];
  virtualTourUrl: string | null;
  agentId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: number;
  name: string;
  photo: string | null;
  phone: string;
  email: string;
  bio: string | null;
  specializations: string[];
  isActive: boolean;
}

export interface Testimonial {
  id: number;
  clientName: string;
  clientPhoto: string | null;
  content: string;
  rating: number;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  author?: { name: string } | null;
}

export interface SiteSettings {
  id: number;
  template: string;
  siteName: string;
  logoUrl: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroImage: string | null;
  aboutContent: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress: string | null;
  mapEmbedUrl: string | null;
  socialLinks: Record<string, string>;
}

export interface SearchFilters {
  type?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
}
