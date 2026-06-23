import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@property/db";
import { testimonials } from "@property/db/schema";
import { eq } from "drizzle-orm";
import { upsertTestimonial } from "@/lib/actions";
import { Button } from "@property/ui";
import { ArrowLeft, Save } from "lucide-react";

export default async function TestimonialFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "0";
  let testimonial = null;

  if (!isNew) {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, Number(id))).limit(1);
    testimonial = result[0];
    if (!testimonial) notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/testimonials"><ArrowLeft className="size-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isNew ? "Add Testimonial" : "Edit Testimonial"}</h1>
        </div>
      </div>

      <form action={upsertTestimonial} className="space-y-6 max-w-2xl">
        <input type="hidden" name="id" value={id} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Client Name</label>
            <input name="clientName" defaultValue={testimonial?.clientName ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Rating (1-5)</label>
            <select name="rating" defaultValue={testimonial?.rating ?? 5} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n>1?"s":""}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium">Content</label>
            <textarea name="content" rows={4} defaultValue={testimonial?.content ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Template</label>
            <select name="template" defaultValue={testimonial?.template ?? "all"} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              <option value="all">All Templates</option>
              <option value="modern">Modern</option>
              <option value="luxury">Luxury</option>
              <option value="classic">Classic</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" value="true" defaultChecked={testimonial?.isActive ?? true} id="isActive" className="rounded border-input" />
            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
          </div>
        </div>
        <Button type="submit"><Save className="size-4" /> {isNew ? "Create Testimonial" : "Update Testimonial"}</Button>
      </form>
    </div>
  );
}
