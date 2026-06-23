"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Button } from "../ui/button.js";
import { Dialog, DialogContent } from "../ui/dialog.js";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function PropertyGallery({ images, title, className }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className={cn("bg-muted flex aspect-video items-center justify-center rounded-lg", className)}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const goTo = (index: number) => {
    setSelectedIndex((index + images.length) % images.length);
  };

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <div
          className="relative aspect-video cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${title} - ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={(e) => { e.stopPropagation(); goTo(selectedIndex - 1); }}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={(e) => { e.stopPropagation(); goTo(selectedIndex + 1); }}
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                  i === selectedIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img} alt={`${title} thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative aspect-video">
            <Image
              src={images[selectedIndex]}
              alt={`${title} - ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => goTo(selectedIndex - 1)}
                >
                  <ChevronLeft className="size-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => goTo(selectedIndex + 1)}
                >
                  <ChevronRight className="size-6" />
                </Button>
              </>
            )}
          </div>
          <p className="text-muted-foreground p-3 text-center text-sm">
            {selectedIndex + 1} / {images.length}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
