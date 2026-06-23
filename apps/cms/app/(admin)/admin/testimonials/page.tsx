import Link from "next/link";
import { db } from "@property/db";
import { testimonials } from "@property/db/schema";
import { Button, Badge } from "@property/ui";
import { deleteTestimonial } from "@/lib/actions";
import { Plus, Pencil, Trash, Star } from "lucide-react";

export default async function TestimonialsPage() {
  const all = await db.select().from(testimonials).orderBy(testimonials.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground text-sm">Manage client testimonials.</p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/0"><Plus className="size-4" /> Add Testimonial</Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <th className="p-3 font-medium">Client</th>
              <th className="p-3 font-medium">Rating</th>
              <th className="p-3 font-medium">Template</th>
              <th className="p-3 font-medium">Active</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {all.map((t) => (
              <tr key={t.id} className="border-t text-sm">
                <td className="p-3 font-medium">{t.clientName}</td>
                <td className="p-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={i < t.rating ? "size-3.5 fill-yellow-400 text-yellow-400" : "size-3.5 text-gray-300"} />
                    ))}
                  </div>
                </td>
                <td className="p-3"><Badge variant="outline" className="capitalize">{t.template}</Badge></td>
                <td className="p-3"><Badge variant={t.isActive ? "default" : "secondary"}>{t.isActive ? "Active" : "Inactive"}</Badge></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/admin/testimonials/${t.id}`}><Pencil className="size-4" /></Link>
                    </Button>
                    <form action={deleteTestimonial}>
                      <input type="hidden" name="id" value={t.id} />
                      <Button size="icon" variant="ghost" type="submit" className="text-destructive"><Trash className="size-4" /></Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {all.length === 0 && (
              <tr><td colSpan={5} className="text-muted-foreground p-8 text-center">No testimonials yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
