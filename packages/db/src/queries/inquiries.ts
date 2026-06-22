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
