import { Suspense } from "react";
import { fetchListings, fetchCities, fetchListingsCount } from "@/lib/data";
import { ListingGrid, SearchFilter, Skeleton } from "@property/ui";
import { Pagination, type SearchParams } from "@/components/pagination";

export const metadata = { title: "Daftar Properti" };

export default async function ListingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filters = {
    type: params.type,
    category: params.category,
    city: params.city,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    search: params.search,
  };
  const page = Number(params.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  const [listings, cities, total] = await Promise.all([
    fetchListings({ ...filters, limit, offset }),
    fetchCities(),
    fetchListingsCount(filters),
  ]);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Daftar Properti</h1>
        <p className="text-muted-foreground text-sm">Temukan properti sesuai kebutuhan Anda.</p>
      </div>
      <SearchFilter cities={cities} />
      <div className="mt-6">
        <Suspense fallback={<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=>(<Skeleton key={i} className="aspect-[4/3] rounded-xl" />))}</div>}>
          <ListingGrid listings={listings as any} />
        </Suspense>
      </div>
      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} />}
    </div>
  );
}
