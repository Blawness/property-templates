import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchArticleBySlug } from "@/lib/data";
import { Calendar, User } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await fetchArticleBySlug(slug);
  return { title: row?.articles?.title ?? row?.title ?? "Article" };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row: any = await fetchArticleBySlug(slug);
  if (!row) notFound();

  const article = row.articles ?? row;
  const author = row.users ?? row.author;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {article.coverImage && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" sizes="(max-width:768px)100vw,66vw" priority />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8">
        {author?.name && <span className="flex items-center gap-1"><User className="size-4" /> {author.name}</span>}
        {article.publishedAt && <span className="flex items-center gap-1"><Calendar className="size-4" /> {new Date(article.publishedAt).toLocaleDateString("id-ID")}</span>}
      </div>
      {article.content ? (
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      ) : (
        <p className="text-muted-foreground">Konten belum tersedia.</p>
      )}
    </div>
  );
}
