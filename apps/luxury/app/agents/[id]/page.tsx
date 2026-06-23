import { notFound } from "next/navigation";
import { fetchAgentById, fetchListingsByAgent } from "@/lib/data";
import { AgentCard, ListingGrid } from "@property/ui";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await fetchAgentById(Number(id));
  return { title: agent?.name ?? "Agent Not Found" };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await fetchAgentById(Number(id));
  if (!agent) notFound();

  const agentListings = await fetchListingsByAgent(agent.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto mb-12">
        <AgentCard agent={agent} showContact />
        {agent.bio && (
          <div className="mt-6 text-muted-foreground" dangerouslySetInnerHTML={{ __html: agent.bio }} />
        )}
      </div>
      {agentListings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Properti oleh {agent.name}</h2>
          <ListingGrid listings={agentListings as any} />
        </div>
      )}
    </div>
  );
}
