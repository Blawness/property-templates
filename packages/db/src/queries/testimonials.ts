import { db } from "../index.js";
import { testimonials } from "../schema.js";
import { and, eq, or } from "drizzle-orm";

export async function getActiveTestimonials(template: string) {
  return db.select().from(testimonials).where(and(
    or(eq(testimonials.template, template as any), eq(testimonials.template, "all")),
    eq(testimonials.isActive, true)
  )).orderBy(testimonials.rating);
}
