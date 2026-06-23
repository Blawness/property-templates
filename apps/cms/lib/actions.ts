"use server";

import { revalidateTag } from "next/cache";
import { db } from "@property/db";
import { listings } from "@property/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@property/ui";

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
    slug,
    title,
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
