import "server-only";
import { db } from "@property/db";
import { siteSettings } from "@property/db/schema";
import { eq } from "drizzle-orm";
import { upsertSettings } from "@/lib/actions";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@property/ui";
import { Save } from "lucide-react";

const templates = ["modern", "luxury", "classic"] as const;

export default async function SettingsPage() {
  const allSettings = await db.select().from(siteSettings);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground text-sm">Configure each template's branding and content.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {templates.map((template) => {
          const s = allSettings.find((x) => x.template === template);
          return (
            <Card key={template}>
              <CardHeader>
                <CardTitle className="capitalize">{template} Template</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={upsertSettings} className="space-y-4">
                  <input type="hidden" name="template" value={template} />
                  {([
                    ["siteName", "Site Name", s?.siteName ?? ""],
                    ["heroTitle", "Hero Title", s?.heroTitle ?? ""],
                    ["heroSubtitle", "Hero Subtitle", s?.heroSubtitle ?? ""],
                    ["heroImage", "Hero Image URL", s?.heroImage ?? ""],
                    ["logoUrl", "Logo URL", s?.logoUrl ?? ""],
                    ["contactPhone", "Contact Phone", s?.contactPhone ?? ""],
                    ["contactEmail", "Contact Email", s?.contactEmail ?? ""],
                    ["contactAddress", "Contact Address", s?.contactAddress ?? ""],
                    ["mapEmbedUrl", "Map Embed URL", s?.mapEmbedUrl ?? ""],
                  ] as const).map(([name, label, value]) => (
                    <div key={name} className="space-y-1">
                      <label className="text-sm font-medium">{label}</label>
                      <input name={name} defaultValue={value} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-sm font-medium">About Content (HTML)</label>
                    <textarea name="aboutContent" rows={4} defaultValue={s?.aboutContent ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm font-mono bg-background" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Social Links (JSON)</label>
                    <input name="socialLinks" defaultValue={JSON.stringify(s?.socialLinks ?? {})} className="border-input w-full rounded-md border px-3 py-2 text-sm font-mono bg-background" />
                  </div>
                  <Button type="submit"><Save className="size-4" /> Save {template}</Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
