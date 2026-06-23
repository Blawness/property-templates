import { fetchSettings } from "@/lib/data";
import { ContactForm, MapEmbed } from "@property/ui";
import { submitInquiry } from "@/actions";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata = { title: "Kontak" };

export default async function ContactPage() {
  const settings = await fetchSettings();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8">Hubungi Kami</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div><ContactForm action={submitInquiry} template="classic" /></div>
        <div className="space-y-6">
          <div className="space-y-4">
            {settings?.contactPhone && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3"><Phone className="size-5 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">Telepon</p><p className="font-medium">{settings.contactPhone}</p></div>
              </div>
            )}
            {settings?.contactEmail && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3"><Mail className="size-5 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{settings.contactEmail}</p></div>
              </div>
            )}
            {settings?.contactAddress && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-3"><MapPin className="size-5 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">Alamat</p><p className="font-medium">{settings.contactAddress}</p></div>
              </div>
            )}
          </div>
          {settings?.mapEmbedUrl && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Lokasi</h2>
              <MapEmbed embedUrl={settings.mapEmbedUrl} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
