"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useTransition } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";
import type { SearchFilters } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SearchFilterProps {
  cities: string[];
  className?: string;
  basePath?: string;
}

export function SearchFilter({ cities, className, basePath = "" }: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout>();

  const updateFilters = useCallback(
    (updates: Partial<SearchFilters>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      startTransition(() => {
        router.push(`${basePath}/listings?${params.toString()}`);
      });
    },
    [router, searchParams, basePath]
  );

  const clearFilters = useCallback(() => {
    startTransition(() => {
      router.push(`${basePath}/listings`);
    });
  }, [router, basePath]);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className={cn("flex flex-wrap items-end gap-3", className)}>
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Cari properti..."
            defaultValue={searchParams.get("search") ?? ""}
            className="pl-9"
            onChange={(e) => {
              clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => updateFilters({ search: e.target.value }), 300);
            }}
          />
        </div>
      </div>

      <Select
        defaultValue={searchParams.get("type") ?? "all"}
        onValueChange={(v) => updateFilters({ type: v })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Tipe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tipe</SelectItem>
          <SelectItem value="sale">Dijual</SelectItem>
          <SelectItem value="rent">Disewa</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("category") ?? "all"}
        onValueChange={(v) => updateFilters({ category: v })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          <SelectItem value="house">Rumah</SelectItem>
          <SelectItem value="apartment">Apartemen</SelectItem>
          <SelectItem value="villa">Villa</SelectItem>
          <SelectItem value="land">Tanah</SelectItem>
          <SelectItem value="commercial">Komersial</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("city") ?? "all"}
        onValueChange={(v) => updateFilters({ city: v })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Kota" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kota</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("bedrooms") ?? "all"}
        onValueChange={(v) => updateFilters({ bedrooms: v === "all" ? undefined : Number(v) })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Kamar Tidur" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Kamar Tidur</SelectItem>
          <SelectItem value="1">1+</SelectItem>
          <SelectItem value="2">2+</SelectItem>
          <SelectItem value="3">3+</SelectItem>
          <SelectItem value="4">4+</SelectItem>
          <SelectItem value="5">5+</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
          <X className="size-3.5" /> Reset
        </Button>
      )}
    </div>
  );
}
