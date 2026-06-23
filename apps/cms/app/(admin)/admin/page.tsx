import { Card, CardContent, CardHeader, CardTitle } from "@property/ui";
import { Building2, Users, Star, FileText, MessageSquare } from "lucide-react";
import { db } from "@property/db";
import { sql } from "drizzle-orm";
import { listings, agents, testimonials, articles, inquiries } from "@property/db/schema";

async function getStats() {
  const [listingCount] = await db.select({ value: sql<number>`count(*)` }).from(listings);
  const [agentCount] = await db.select({ value: sql<number>`count(*)` }).from(agents);
  const [testimonialCount] = await db.select({ value: sql<number>`count(*)` }).from(testimonials);
  const [articleCount] = await db.select({ value: sql<number>`count(*)` }).from(articles);
  const [inquiryCount] = await db.select({ value: sql<number>`count(*)` }).from(inquiries).where(sql`status = 'new'`);

  return {
    listings: Number(listingCount?.value ?? 0),
    agents: Number(agentCount?.value ?? 0),
    testimonials: Number(testimonialCount?.value ?? 0),
    articles: Number(articleCount?.value ?? 0),
    inquiries: Number(inquiryCount?.value ?? 0),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of all content across templates.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><Building2 className="size-4" /> Listings</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.listings}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><Users className="size-4" /> Agents</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.agents}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><Star className="size-4" /> Testimonials</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.testimonials}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><FileText className="size-4" /> Articles</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.articles}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="size-4" /> New Inquiries</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.inquiries}</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
