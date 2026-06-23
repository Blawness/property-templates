import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { cn, formatPrice } from "../../lib/utils.js";
import type { Listing } from "../../types.js";
import { Card, CardContent } from "../ui/card.js";
import { Badge } from "../ui/badge.js";

interface ListingCardProps {
  listing: Listing;
  className?: string;
  basePath?: string;
}

export function ListingCard({ listing, className, basePath = "" }: ListingCardProps) {
  const imageUrl = listing.images[0] ?? "/placeholder-property.jpg";
  const typeLabel = listing.type === "sale" ? "Dijual" : "Disewa";

  return (
    <Link href={`${basePath}/listings/${listing.slug}`}>
      <Card className={cn("group overflow-hidden transition-shadow hover:shadow-lg", className)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <Badge className="absolute top-3 left-3">{typeLabel}</Badge>
          {listing.isFeatured && (
            <Badge variant="secondary" className="absolute top-3 right-3">Featured</Badge>
          )}
        </div>
        <CardContent className="space-y-2 pt-4">
          <p className="text-lg font-bold">{formatPrice(listing.price)}</p>
          <h3 className="line-clamp-1 font-medium">{listing.title}</h3>
          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <MapPin className="size-3.5" />
            {listing.city}
          </p>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            {listing.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="size-3.5" /> {listing.bedrooms}
              </span>
            )}
            {listing.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="size-3.5" /> {listing.bathrooms}
              </span>
            )}
            {listing.buildingArea != null && (
              <span className="flex items-center gap-1">
                <Maximize className="size-3.5" /> {listing.buildingArea}m²
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
