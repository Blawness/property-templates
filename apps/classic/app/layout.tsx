import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { fetchSettings } from "@/lib/data";
import { Navbar, Footer } from "@property/ui";
import "./globals.css";

const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Griya Nusantara", template: "%s | Griya Nusantara" },
  description: "Properti terpercaya untuk keluarga Indonesia",
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
    <html lang="id" className={`${inter.className} ${lora.variable}`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col">
        <Navbar
          siteName={settings?.siteName ?? "Griya Nusantara"}
          logoUrl={settings?.logoUrl}
          links={navLinks}
        />
        <main className="flex-1">{children}</main>
        <Footer
          siteName={settings?.siteName ?? "Griya Nusantara"}
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
