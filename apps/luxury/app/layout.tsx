import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { fetchSettings } from "@/lib/data";
import { Navbar, Footer } from "@property/ui";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Luxury Estates", template: "%s | Luxury Estates" },
  description: "Curated collection of the finest properties",
};

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/listings" },
  { label: "Blog", href: "/blog" },
  { label: "Tentang", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettings();

  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans">
        <Navbar
          siteName={settings?.siteName ?? "Luxury Estates"}
          logoUrl={settings?.logoUrl}
          links={navLinks}
        />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={settings?.siteName ?? "Luxury Estates"}
          links={navLinks}
          contactPhone={settings?.contactPhone}
          contactEmail={settings?.contactEmail}
          contactAddress={settings?.contactAddress}
          socialLinks={settings?.socialLinks ?? {}}
        />
      </body>
    </html>
  );
}
