"use server";

import { revalidateTag } from "next/cache";
import { db } from "@property/db";
import { listings, agents, testimonials, articles, siteSettings, inquiries } from "@property/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@property/ui";

// Listings
export async function deleteListing(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(listings).where(eq(listings.id, id));
  revalidateTag("listings");
}

export async function upsertListing(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const data = {
    slug, title,
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    currency: (formData.get("currency") as string) || "IDR",
    type: formData.get("type") as any,
    category: formData.get("category") as any,
    bedrooms: Number(formData.get("bedrooms")) || null,
    bathrooms: Number(formData.get("bathrooms")) || null,
    landArea: Number(formData.get("landArea")) || null,
    buildingArea: Number(formData.get("buildingArea")) || null,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    province: formData.get("province") as string || null,
    features: JSON.parse((formData.get("features") as string) || "[]"),
    images: JSON.parse((formData.get("images") as string) || "[]"),
    isFeatured: formData.get("isFeatured") === "true",
    status: formData.get("status") as any,
    template: formData.get("template") as any,
    agentId: Number(formData.get("agentId")) || null,
  };
  if (id && id !== "0") {
    await db.update(listings).set({ ...data, updatedAt: new Date() }).where(eq(listings.id, Number(id)));
  } else {
    await db.insert(listings).values(data as any);
  }
  revalidateTag("listings");
}

// Agents
export async function deleteAgent(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(agents).where(eq(agents.id, id));
  revalidateTag("agents");
}

export async function upsertAgent(formData: FormData) {
  const id = formData.get("id") as string;
  const specializations = (formData.get("specializations") as string).split(",").map(s => s.trim()).filter(Boolean);
  const data = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    bio: formData.get("bio") as string || null,
    specializations,
    isActive: formData.get("isActive") === "true",
  };
  if (id && id !== "0") {
    await db.update(agents).set({ ...data, updatedAt: new Date() }).where(eq(agents.id, Number(id)));
  } else {
    await db.insert(agents).values(data as any);
  }
  revalidateTag("agents");
}

// Testimonials
export async function deleteTestimonial(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidateTag("testimonials");
}

export async function upsertTestimonial(formData: FormData) {
  const id = formData.get("id") as string;
  const data = {
    clientName: formData.get("clientName") as string,
    content: formData.get("content") as string,
    rating: Number(formData.get("rating")),
    template: formData.get("template") as any,
    isActive: formData.get("isActive") === "true",
  };
  if (id && id !== "0") {
    await db.update(testimonials).set(data).where(eq(testimonials.id, Number(id)));
  } else {
    await db.insert(testimonials).values(data as any);
  }
  revalidateTag("testimonials");
}

// Articles
export async function deleteArticle(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.delete(articles).where(eq(articles.id, id));
  revalidateTag("articles");
}

export async function upsertArticle(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const data = {
    slug, title,
    content: formData.get("content") as string || null,
    excerpt: formData.get("excerpt") as string || null,
    coverImage: formData.get("coverImage") as string || null,
    template: formData.get("template") as any,
    status: formData.get("status") as any,
  };
  if (id && id !== "0") {
    await db.update(articles).set({ ...data, updatedAt: new Date() }).where(eq(articles.id, Number(id)));
    if (data.status === "published") {
      await db.update(articles).set({ publishedAt: new Date() }).where(eq(articles.id, Number(id)));
    }
  } else {
    await db.insert(articles).values({
      ...data,
      authorId: 1, // default admin user
      publishedAt: data.status === "published" ? new Date() : null,
    } as any);
  }
  revalidateTag("articles");
}

// Settings
export async function upsertSettings(formData: FormData) {
  const template = formData.get("template") as string;
  const data = {
    template,
    siteName: formData.get("siteName") as string,
    heroTitle: formData.get("heroTitle") as string || null,
    heroSubtitle: formData.get("heroSubtitle") as string || null,
    heroImage: formData.get("heroImage") as string || null,
    logoUrl: formData.get("logoUrl") as string || null,
    aboutContent: formData.get("aboutContent") as string || null,
    contactPhone: formData.get("contactPhone") as string || null,
    contactEmail: formData.get("contactEmail") as string || null,
    contactAddress: formData.get("contactAddress") as string || null,
    mapEmbedUrl: formData.get("mapEmbedUrl") as string || null,
    socialLinks: JSON.parse((formData.get("socialLinks") as string) || "{}"),
    updatedAt: new Date(),
  };
  const existing = await db.select().from(siteSettings).where(eq(siteSettings.template, template)).limit(1);
  if (existing[0]) {
    await db.update(siteSettings).set(data).where(eq(siteSettings.template, template));
  } else {
    await db.insert(siteSettings).values(data as any);
  }
  revalidateTag("settings");
}

// Inquiries
export async function markInquiryRead(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  await db.update(inquiries).set({ status: "read" as any }).where(eq(inquiries.id, id));
  revalidateTag("inquiries");
}
