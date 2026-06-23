import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@property/db";
import { articles } from "@property/db/schema";
import { eq } from "drizzle-orm";
import { upsertArticle } from "@/lib/actions";
import { Button } from "@property/ui";
import { ArrowLeft, Save } from "lucide-react";

export default async function ArticleFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "0";
  let article = null;

  if (!isNew) {
    const result = await db.select().from(articles).where(eq(articles.id, Number(id))).limit(1);
    article = result[0];
    if (!article) notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/articles"><ArrowLeft className="size-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isNew ? "Add Article" : "Edit Article"}</h1>
        </div>
      </div>

      <form action={upsertArticle} className="space-y-6 max-w-2xl">
        <input type="hidden" name="id" value={id} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input name="title" defaultValue={article?.title ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Template</label>
            <select name="template" defaultValue={article?.template ?? "all"} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              <option value="all">All Templates</option>
              <option value="modern">Modern</option>
              <option value="luxury">Luxury</option>
              <option value="classic">Classic</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select name="status" defaultValue={article?.status ?? "draft"} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Excerpt</label>
            <textarea name="excerpt" rows={2} defaultValue={article?.excerpt ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Cover Image URL</label>
            <input name="coverImage" defaultValue={article?.coverImage ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium">Content (HTML)</label>
            <textarea name="content" rows={10} defaultValue={article?.content ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm font-mono bg-background" />
          </div>
        </div>
        <Button type="submit"><Save className="size-4" /> {isNew ? "Create Article" : "Update Article"}</Button>
      </form>
    </div>
  );
}
