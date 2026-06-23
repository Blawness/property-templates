import { MediaLibraryScreen } from "@blawness/admin-kit/screens/media";
import { handleDeleteMedia } from "@blawness/admin-kit/screens/media/lib";
import { db } from "@property/db";
import { listings, articles, agents, testimonials, siteSettings } from "@property/db/schema";

async function queryTable(table: any) {
  try {
    return await db.select().from(table);
  } catch {
    return [];
  }
}

async function referenceChecker(url: string): Promise<boolean> {
  const allRows = [
    ...(await queryTable(listings)),
    ...(await queryTable(articles)),
    ...(await queryTable(agents)),
    ...(await queryTable(testimonials)),
    ...(await queryTable(siteSettings)),
  ];

  const json = JSON.stringify(allRows);
  return json.includes(url);
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
