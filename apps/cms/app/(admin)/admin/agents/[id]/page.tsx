import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@property/db";
import { agents } from "@property/db/schema";
import { eq } from "drizzle-orm";
import { upsertAgent } from "@/lib/actions";
import { Button } from "@property/ui";
import { ArrowLeft, Save } from "lucide-react";

export default async function AgentFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "0";
  let agent = null;

  if (!isNew) {
    const result = await db.select().from(agents).where(eq(agents.id, Number(id))).limit(1);
    agent = result[0];
    if (!agent) notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/agents"><ArrowLeft className="size-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isNew ? "Add Agent" : "Edit Agent"}</h1>
          <p className="text-muted-foreground text-sm">{isNew ? "Create a new agent." : `Editing: ${agent?.name}`}</p>
        </div>
      </div>

      <form action={upsertAgent} className="space-y-6 max-w-2xl">
        <input type="hidden" name="id" value={id} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input name="name" defaultValue={agent?.name ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone</label>
            <input name="phone" defaultValue={agent?.phone ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input name="email" type="email" defaultValue={agent?.email ?? ""} required className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium">Bio</label>
            <textarea name="bio" rows={3} defaultValue={agent?.bio ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium">Specializations (comma-separated)</label>
            <input name="specializations" defaultValue={agent?.specializations?.join(", ") ?? ""} className="border-input w-full rounded-md border px-3 py-2 text-sm bg-background" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" value="true" defaultChecked={agent?.isActive ?? true} id="isActive" className="rounded border-input" />
            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
          </div>
        </div>
        <Button type="submit"><Save className="size-4" /> {isNew ? "Create Agent" : "Update Agent"}</Button>
      </form>
    </div>
  );
}
