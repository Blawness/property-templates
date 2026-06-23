import Link from "next/link";
import { fetchFeaturedListings, fetchTestimonials, fetchSettings } from "@/lib/data";
import { ListingCard, TestimonialCard, Button, Skeleton } from "@property/ui";
import { Search, ArrowRight } from "lucide-react";
import { Suspense } from "react";

async function FeaturedListings() {
  const listings = await fetchFeaturedListings();
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l: any) => {
        const listing = l.listings ?? l;
        return <ListingCard key={listing.id} listing={listing} basePath="" />;
      })}
    </div>
  );
}

export default async function HomePage() {
  const [settings, testimonials] = await Promise.all([fetchSettings(), fetchTestimonials()]);

  return (
    <div>
      <section className="relative flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 py-24">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-serif">
            {settings?.heroTitle ?? "Rumah Keluarga, Kebahagiaan Anda"}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            {settings?.heroSubtitle ?? "Properti terpercaya untuk keluarga Indonesia sejak 2010"}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/listings"><Search className="size-4" /> Cari Properti</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Tentang Kami <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Properti Unggulan</h2>
            <p className="text-muted-foreground text-sm">Pilihan properti terbaik untuk Anda.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/listings">Lihat Semua <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
        <Suspense fallback={<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:3}).map((_,i)=>(<Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />))}</div>}>
          <FeaturedListings />
        </Suspense>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">Testimoni Klien</h2>
              <p className="text-muted-foreground text-sm">Apa kata mereka tentang kami.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((t: any) => <TestimonialCard key={t.id} testimonial={t} />)}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold">Butuh Bantuan?</h2>
          <p className="text-muted-foreground mt-2">Hubungi tim kami untuk konsultasi properti gratis.</p>
          <Button asChild className="mt-6">
            <Link href="/contact">Hubungi Kami</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
