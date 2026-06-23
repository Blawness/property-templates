import { db } from "@property/db";
import { inquiries } from "@property/db/schema";
import { desc } from "drizzle-orm";
import { Badge, Button } from "@property/ui";
import { markInquiryRead } from "@/lib/actions";
import { Check } from "lucide-react";

export default async function InquiriesPage() {
  const all = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground text-sm">Contact form submissions from all templates.</p>
      </div>
      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Template</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {all.map((inq) => (
              <tr key={inq.id} className="border-t text-sm">
                <td className="p-3">
                  <p className="font-medium">{inq.name}</p>
                  <p className="text-muted-foreground text-xs">{inq.message.slice(0, 80)}{inq.message.length > 80 ? "..." : ""}</p>
                </td>
                <td className="p-3">{inq.email}</td>
                <td className="p-3"><Badge variant="outline" className="capitalize">{inq.template}</Badge></td>
                <td className="p-3"><Badge variant={inq.status === "new" ? "default" : "secondary"} className="capitalize">{inq.status}</Badge></td>
                <td className="p-3">
                  {inq.status === "new" && (
                    <form action={markInquiryRead}>
                      <input type="hidden" name="id" value={inq.id} />
                      <Button size="sm" variant="ghost" type="submit">
                        <Check className="size-4" /> Mark Read
                      </Button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {all.length === 0 && (
              <tr><td colSpan={5} className="text-muted-foreground p-8 text-center">No inquiries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
