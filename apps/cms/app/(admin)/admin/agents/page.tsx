import Link from "next/link";
import { db } from "@property/db";
import { agents } from "@property/db/schema";
import { Button, Badge } from "@property/ui";
import { deleteAgent } from "@/lib/actions";
import { Plus, Pencil, Trash } from "lucide-react";

export default async function AgentsPage() {
  const allAgents = await db.select().from(agents).orderBy(agents.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-muted-foreground text-sm">Manage real estate agents.</p>
        </div>
        <Button asChild>
          <Link href="/admin/agents/0"><Plus className="size-4" /> Add Agent</Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Active</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allAgents.map((a) => (
              <tr key={a.id} className="border-t text-sm">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.phone}</td>
                <td className="p-3">{a.email}</td>
                <td className="p-3"><Badge variant={a.isActive ? "default" : "secondary"}>{a.isActive ? "Active" : "Inactive"}</Badge></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/admin/agents/${a.id}`}><Pencil className="size-4" /></Link>
                    </Button>
                    <form action={deleteAgent}>
                      <input type="hidden" name="id" value={a.id} />
                      <Button size="icon" variant="ghost" type="submit" className="text-destructive"><Trash className="size-4" /></Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {allAgents.length === 0 && (
              <tr><td colSpan={5} className="text-muted-foreground p-8 text-center">No agents yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
