import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@property/db";
import { listings, agents } from "@property/db/schema";
import { eq } from "drizzle-orm";
import { upsertListing } from "@/lib/actions";
import { Button } from "@property/ui";
import { ArrowLeft, Save } from "lucide-react";

export default async function ListingFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "0";
  let listing = null;

  if (!isNew) {
    const result = await db.select().from(listings).where(eq(listings.id, Number(id))).limit(1);
    listing = result[0];
    if (!listing) notFound();
  }

  const allAgents = await db.select({ id: agents.id, name: agents.name }).from(agents).where(eq(agents.isActive, true));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/listings"><ArrowLeft className="size-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isNew ? "Add Listing" : "Edit Listing"}</h1>
          <p className="text-muted-foreground text-sm">{isNew ? "Create a new property listing." : `Editing: ${listing?.title}`}</p>
        </div>
      </div>

      <form action={upsertListing} className="space-y-6 max-w-2xl">
        <input type="hidden" name="id" value={id} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input name="title" defaultValue={listing?.title ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Price</label>
            <input name="price" defaultValue={listing?.price ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Currency</label>
            <input name="currency" defaultValue={listing?.currency ?? "IDR"} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Type</label>
            <select name="type" defaultValue={listing?.type ?? "sale"} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              <option value="sale">Dijual</option>
              <option value="rent">Disewa</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <select name="category" defaultValue={listing?.category ?? "house"} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              <option value="house">Rumah</option>
              <option value="apartment">Apartemen</option>
              <option value="villa">Villa</option>
              <option value="land">Tanah</option>
              <option value="commercial">Komersial</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Bedrooms</label>
            <input name="bedrooms" type="number" defaultValue={listing?.bedrooms ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Bathrooms</label>
            <input name="bathrooms" type="number" defaultValue={listing?.bathrooms ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Land Area (m²)</label>
            <input name="landArea" type="number" defaultValue={listing?.landArea ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Building Area (m²)</label>
            <input name="buildingArea" type="number" defaultValue={listing?.buildingArea ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Address</label>
            <input name="address" defaultValue={listing?.address ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">City</label>
            <input name="city" defaultValue={listing?.city ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Province</label>
            <input name="province" defaultValue={listing?.province ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Agent</label>
            <select name="agentId" defaultValue={listing?.agentId ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              <option value="">None</option>
              {allAgents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Template</label>
            <select name="template" defaultValue={listing?.template ?? "all"} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              <option value="all">All Templates</option>
              <option value="modern">Modern</option>
              <option value="luxury">Luxury</option>
              <option value="classic">Classic</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select name="status" defaultValue={listing?.status ?? "draft"} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              <option value="draft">Draft</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" value="true" defaultChecked={listing?.isFeatured ?? false} id="isFeatured" className="rounded border-input" />
            <label htmlFor="isFeatured" className="text-sm font-medium">Featured</label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Description (HTML)</label>
          <textarea name="description" rows={6} defaultValue={listing?.description ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm font-mono bg-background" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Features (JSON array)</label>
          <input name="features" defaultValue={JSON.stringify(listing?.features ?? [])} className="border-input w-full rounded-md border px-3 py-2 text-sm font-mono bg-background" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Images (JSON array of URLs)</label>
          <input name="images" defaultValue={JSON.stringify(listing?.images ?? [])} className="border-input w-full rounded-md border px-3 py-2 text-sm font-mono bg-background" />
        </div>

        <Button type="submit">
          <Save className="size-4" /> {isNew ? "Create Listing" : "Update Listing"}
        </Button>
      </form>
    </div>
  );
}
