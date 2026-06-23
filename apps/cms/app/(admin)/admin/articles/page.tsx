import Link from "next/link";
import { db } from "@property/db";
import { articles } from "@property/db/schema";
import { desc } from "drizzle-orm";
import { Button, Badge } from "@property/ui";
import { deleteArticle } from "@/lib/actions";
import { Plus, Pencil, Trash } from "lucide-react";

export default async function ArticlesPage() {
  const all = await db.select().from(articles).orderBy(desc(articles.updatedAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-muted-foreground text-sm">Manage blog articles.</p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/0"><Plus className="size-4" /> Add Article</Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Template</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {all.map((a) => (
              <tr key={a.id} className="border-t text-sm">
                <td className="p-3 font-medium">{a.title}</td>
                <td className="p-3"><Badge variant="outline" className="capitalize">{a.template}</Badge></td>
                <td className="p-3"><Badge variant={a.status === "published" ? "default" : "secondary"} className="capitalize">{a.status}</Badge></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/admin/articles/${a.id}`}><Pencil className="size-4" /></Link>
                    </Button>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={a.id} />
                      <Button size="icon" variant="ghost" type="submit" className="text-destructive"><Trash className="size-4" /></Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {all.length === 0 && (
              <tr><td colSpan={4} className="text-muted-foreground p-8 text-center">No articles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
