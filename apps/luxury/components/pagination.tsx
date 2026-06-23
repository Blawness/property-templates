import Link from "next/link";
import { Button } from "@property/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type SearchParams = Record<string, string | undefined>;

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const createUrl = (page: number) => `/listings?page=${page}`;
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      {currentPage > 1 && (
        <Button variant="outline" size="sm" asChild>
          <Link href={createUrl(currentPage - 1)}><ChevronLeft className="size-4" /> Prev</Link>
        </Button>
      )}
      <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
      {currentPage < totalPages && (
        <Button variant="outline" size="sm" asChild>
          <Link href={createUrl(currentPage + 1)}>Next <ChevronRight className="size-4" /></Link>
        </Button>
      )}
    </div>
  );
}
