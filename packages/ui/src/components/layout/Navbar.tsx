import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { Button } from "../ui/button.js";

interface NavbarProps {
  siteName: string;
  logoUrl?: string | null;
  links: { label: string; href: string }[];
  className?: string;
}

export function Navbar({ siteName, logoUrl, links, className }: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={siteName} width={120} height={40} className="h-8 w-auto" />
          ) : (
            <span className="text-xl font-bold">{siteName}</span>
          )}
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
          <Menu className="size-5" />
        </Button>
      </nav>
    </header>
  );
}
