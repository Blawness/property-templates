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
