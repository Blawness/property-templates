import { fetchSettings } from "@/lib/data";
import { MapEmbed } from "@property/ui";

export const metadata = { title: "Tentang Kami" };

export default async function AboutPage() {
  const settings = await fetchSettings();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Tentang {settings?.siteName ?? "Kami"}</h1>
        {settings?.aboutContent ? (
          <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: settings.aboutContent }} />
        ) : (
          <p className="text-muted-foreground">Konten tentang kami akan segera tersedia.</p>
        )}
      </div>
      {settings?.mapEmbedUrl && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Lokasi Kami</h2>
          <MapEmbed embedUrl={settings.mapEmbedUrl} />
        </div>
      )}
    </div>
  );
}
