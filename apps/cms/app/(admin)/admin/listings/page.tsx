import Link from "next/link";
import { db } from "@property/db";
import { listings } from "@property/db/schema";
import { desc } from "drizzle-orm";
import { Button, Badge } from "@property/ui";
import { formatPrice } from "@property/ui";
import { deleteListing } from "@/lib/actions";
import { Plus, Pencil, Trash } from "lucide-react";

export default async function ListingsPage() {
  const allListings = await db.select({
    id: listings.id,
    title: listings.title,
    price: listings.price,
    type: listings.type,
    city: listings.city,
    status: listings.status,
    template: listings.template,
    isFeatured: listings.isFeatured,
  }).from(listings).orderBy(desc(listings.updatedAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listings</h1>
          <p className="text-muted-foreground text-sm">Manage property listings across all templates.</p>
        </div>
        <Button asChild>
          <Link href="/admin/listings/0"><Plus className="size-4" /> Add Listing</Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">City</th>
              <th className="p-3 font-medium">Template</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allListings.map((l) => (
              <tr key={l.id} className="border-t text-sm">
                <td className="p-3 font-medium">
                  {l.title}
                  {l.isFeatured && <Badge className="ml-2" variant="secondary">Featured</Badge>}
                </td>
                <td className="p-3">{formatPrice(String(l.price))}</td>
                <td className="p-3 capitalize">{l.type}</td>
                <td className="p-3">{l.city}</td>
                <td className="p-3"><Badge variant="outline" className="capitalize">{l.template}</Badge></td>
                <td className="p-3"><Badge variant={l.status === "available" ? "default" : "secondary"} className="capitalize">{l.status}</Badge></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/admin/listings/${l.id}`}><Pencil className="size-4" /></Link>
                    </Button>
                    <form action={deleteListing}>
                      <input type="hidden" name="id" value={l.id} />
                      <Button size="icon" variant="ghost" type="submit" className="text-destructive">
                        <Trash className="size-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {allListings.length === 0 && (
              <tr>
                <td colSpan={7} className="text-muted-foreground p-8 text-center">No listings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
