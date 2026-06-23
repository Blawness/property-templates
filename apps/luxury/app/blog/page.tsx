import Link from "next/link";
import Image from "next/image";
import { fetchArticles } from "@/lib/data";
import { Card, CardContent } from "@property/ui";
import { Calendar } from "lucide-react";

export const metadata = { title: "Blog" };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 6;
  const articles = await fetchArticles(limit, (page - 1) * limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground text-sm mb-8">Artikel terbaru seputar properti.</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article: any) => (
          <Link key={article.id} href={`/blog/${article.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video">
                {article.coverImage ? (
                  <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="(max-width:640px)100vw,33vw" />
                ) : (
                  <div className="bg-muted flex h-full w-full items-center justify-center text-muted-foreground">No Image</div>
                )}
              </div>
              <CardContent className="space-y-2 pt-4">
                <h2 className="font-semibold line-clamp-2">{article.title}</h2>
                {article.excerpt && <p className="text-muted-foreground text-sm line-clamp-2">{article.excerpt}</p>}
                {article.publishedAt && (
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(article.publishedAt).toLocaleDateString("id-ID")}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">Belum ada artikel.</p>
        )}
      </div>
    </div>
  );
}
