import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { fetchSettings } from "@/lib/data";
import { Navbar, Footer } from "@property/ui";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Properti Modern", template: "%s | Properti Modern" },
  description: "Temukan hunian impian Anda di Properti Modern.",
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
    <html lang="id" className={font.className}>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <Navbar
          siteName={settings?.siteName ?? "Properti Modern"}
          logoUrl={settings?.logoUrl}
          links={navLinks}
        />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={settings?.siteName ?? "Properti Modern"}
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
