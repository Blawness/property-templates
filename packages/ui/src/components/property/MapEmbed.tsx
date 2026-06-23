import { cn } from "../../lib/utils";

interface MapEmbedProps {
  embedUrl: string;
  className?: string;
}

export function MapEmbed({ embedUrl, className }: MapEmbedProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg", className)}>
      <iframe
        src={embedUrl}
        title="Location Map"
        className="h-[400px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}
