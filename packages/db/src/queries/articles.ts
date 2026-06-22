import { db } from "../index.js";
import { articles, users } from "../schema.js";
import { and, eq, or, desc } from "drizzle-orm";

export async function getPublishedArticles(template: string, limit = 12, offset = 0) {
  return db
    .select({
      id: articles.id, slug: articles.slug, title: articles.title,
      excerpt: articles.excerpt, coverImage: articles.coverImage,
      publishedAt: articles.publishedAt,
      author: { name: users.name },
    })
    .from(articles)
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(and(
      or(eq(articles.template, template as any), eq(articles.template, "all")),
      eq(articles.status, "published")
    ))
    .orderBy(desc(articles.publishedAt))
    .limit(limit).offset(offset);
}

export async function getArticleBySlug(slug: string, template: string) {
  const result = await db
    .select()
    .from(articles)
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(and(
      eq(articles.slug, slug),
      or(eq(articles.template, template as any), eq(articles.template, "all")),
      eq(articles.status, "published")
    ))
    .limit(1);
  return result[0] ?? null;
}
