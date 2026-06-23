import { cn } from "../../lib/utils.js";

interface VirtualTourEmbedProps {
  url: string;
  className?: string;
}

export function VirtualTourEmbed({ url, className }: VirtualTourEmbedProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold">Virtual Tour 360°</h3>
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <iframe
          src={url}
          title="Virtual Tour"
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
