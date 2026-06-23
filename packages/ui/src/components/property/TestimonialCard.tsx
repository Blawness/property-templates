import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils.js";
import type { Testimonial } from "../../types.js";
import { Card, CardContent } from "../ui/card.js";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-full">
            {testimonial.clientPhoto ? (
              <Image src={testimonial.clientPhoto} alt={testimonial.clientName} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center font-bold">
                {testimonial.clientName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{testimonial.clientName}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn("size-3.5", i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm italic">&ldquo;{testimonial.content}&rdquo;</p>
      </CardContent>
    </Card>
  );
}
