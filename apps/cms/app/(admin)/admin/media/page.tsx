import { MediaLibraryScreen } from "@blawness/admin-kit/screens/media";
import { handleDeleteMedia } from "@blawness/admin-kit/screens/media/lib";
import { db } from "@property/db";
import { listings, articles, agents, testimonials, siteSettings } from "@property/db/schema";

async function referenceChecker(url: string): Promise<boolean> {
  const tables: any[][] = [
    tryGet(await db.select().from(listings)),
    tryGet(await db.select().from(articles)),
    tryGet(await db.select().from(agents)),
    tryGet(await db.select().from(testimonials)),
    tryGet(await db.select().from(siteSettings)),
  ].filter(Boolean);
  async function tryGet(promise: any) { try { return await promise; } catch { return null; } }

  for (const rows of tables) {
    if (!rows) continue;
    const json = JSON.stringify(rows);
    if (json.includes(url)) return true;
  }
  return false;
}

export default async function MediaPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  return (
    <MediaLibraryScreen
      searchParams={searchParams}
      deleteAction={async (formData: FormData) => {
        "use server";
        await handleDeleteMedia(formData, referenceChecker);
      }}
    />
  );
}
