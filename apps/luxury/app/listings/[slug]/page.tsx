import { notFound } from "next/navigation";
import { fetchListingBySlug } from "@/lib/data";
import { PropertyGallery, AgentCard, MortgageCalculator, ContactForm, VirtualTourEmbed, Badge } from "@property/ui";
import { formatPrice } from "@property/ui";
import { Bed, Bath, Maximize, MapPin, Check } from "lucide-react";
import { submitInquiry } from "@/actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await fetchListingBySlug(slug);
  return { title: row?.listings?.title ?? "Properti Tidak Ditemukan" };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row: any = await fetchListingBySlug(slug);
  if (!row) notFound();

  const listing = row.listings ?? row;
  const agent = row.agents ?? listing.agent;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PropertyGallery images={(listing.images ?? []) as string[]} title={listing.title} className="mb-8" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge>{listing.type === "sale" ? "Dijual" : "Disewa"}</Badge>
              <Badge variant="outline" className="capitalize">{listing.category}</Badge>
              <Badge variant="secondary" className="capitalize">{listing.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="size-4" /> {listing.address}, {listing.city}
            </p>
            <p className="text-3xl font-bold text-primary mt-4">{formatPrice(String(listing.price))}</p>
          </div>

          <div className="flex gap-6 text-sm">
            {listing.bedrooms != null && <span className="flex items-center gap-1"><Bed className="size-4" /> {listing.bedrooms} Kamar Tidur</span>}
            {listing.bathrooms != null && <span className="flex items-center gap-1"><Bath className="size-4" /> {listing.bathrooms} Kamar Mandi</span>}
            {listing.landArea != null && <span className="flex items-center gap-1"><Maximize className="size-4" /> {listing.landArea} m² Tanah</span>}
            {listing.buildingArea != null && <span className="flex items-center gap-1"><Maximize className="size-4" /> {listing.buildingArea} m² Bangunan</span>}
          </div>

          {listing.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
              <div className="text-muted-foreground prose prose-sm" dangerouslySetInnerHTML={{ __html: listing.description }} />
            </div>
          )}

          {(listing.features as string[])?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Fasilitas</h2>
              <div className="grid grid-cols-2 gap-2">
                {(listing.features as string[]).map((f: string) => (
                  <span key={f} className="flex items-center gap-2 text-sm"><Check className="size-4 text-primary" /> {f}</span>
                ))}
              </div>
            </div>
          )}

          {listing.virtualTourUrl && <VirtualTourEmbed url={listing.virtualTourUrl} />}
        </div>

        <div className="space-y-6">
          {agent && <AgentCard agent={{ ...agent, photo: agent.photo ?? null }} showContact />}
          <ContactForm action={submitInquiry} listingId={listing.id} template="luxury" />
          <MortgageCalculator propertyPrice={String(listing.price)} />
        </div>
      </div>
    </div>
  );
}
