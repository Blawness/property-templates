import { db } from "../index";
import { testimonials } from "../schema";
import { and, eq, or, desc } from "drizzle-orm";

export async function getActiveTestimonials(template: string) {
  return db.select().from(testimonials).where(and(
    or(eq(testimonials.template, template as any), eq(testimonials.template, "all")),
    eq(testimonials.isActive, true)
  )).orderBy(desc(testimonials.rating));
}
