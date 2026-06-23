import { db } from "../index";
import { agents } from "../schema";
import { eq } from "drizzle-orm";

export async function getActiveAgents() {
  return db.select().from(agents).where(eq(agents.isActive, true));
}

export async function getAgentById(id: number) {
  const result = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
  return result[0] ?? null;
}
