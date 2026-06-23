import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Separator } from "../ui/separator.js";

interface FooterProps {
  siteName: string;
  links: { label: string; href: string }[];
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactAddress?: string | null;
  socialLinks?: Record<string, string>;
  className?: string;
}

export function Footer({
  siteName,
  links,
  contactPhone,
  contactEmail,
  contactAddress,
  socialLinks = {},
  className,
}: FooterProps) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{siteName}</h3>
            {contactAddress && (
              <p className="text-muted-foreground flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 size-4 flex-shrink-0" />
                {contactAddress}
              </p>
            )}
            {contactPhone && (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Phone className="size-4" /> {contactPhone}
              </p>
            )}
            {contactEmail && (
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <Mail className="size-4" /> {contactEmail}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Menu</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {Object.keys(socialLinks).length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold">Sosial Media</h4>
              <ul className="space-y-2">
                {Object.entries(socialLinks).map(([platform, url]) => (
                  <li key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground text-sm capitalize transition-colors"
                    >
                      {platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
