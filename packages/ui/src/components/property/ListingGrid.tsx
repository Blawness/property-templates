import { cn } from "../../lib/utils";
import type { Listing } from "../../types";
import { ListingCard } from "./ListingCard";

interface ListingGridProps {
  listings: Listing[];
  className?: string;
  basePath?: string;
  emptyMessage?: string;
}

export function ListingGrid({
  listings,
  className,
  basePath = "",
  emptyMessage = "Tidak ada properti ditemukan.",
}: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          basePath={basePath}
        />
      ))}
    </div>
  );
}
