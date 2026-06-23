import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { cn } from "../../lib/utils.js";
import type { Agent } from "../../types.js";
import { Card, CardContent } from "../ui/card.js";
import { Badge } from "../ui/badge.js";

interface AgentCardProps {
  agent: Agent;
  className?: string;
  basePath?: string;
  showContact?: boolean;
}

export function AgentCard({ agent, className, basePath = "", showContact = true }: AgentCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <CardContent className="space-y-3 pt-6">
        <div className="relative mx-auto size-24 overflow-hidden rounded-full">
          {agent.photo ? (
            <Image src={agent.photo} alt={agent.name} fill className="object-cover" sizes="96px" />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center text-2xl font-bold">
              {agent.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <Link href={`${basePath}/agents/${agent.id}`} className="font-semibold hover:underline">
            {agent.name}
          </Link>
          {agent.specializations.length > 0 && (
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {agent.specializations.map((spec) => (
                <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
              ))}
            </div>
          )}
        </div>
        {showContact && (
          <div className="text-muted-foreground space-y-1 text-sm">
            <p className="flex items-center justify-center gap-1">
              <Phone className="size-3.5" /> {agent.phone}
            </p>
            <p className="flex items-center justify-center gap-1">
              <Mail className="size-3.5" /> {agent.email}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
