import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import type { SessionPayload } from "@/lib/auth-tokens";

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireUserId(): Promise<string> {
  const session = await requireSession();
  return session.userId;
}
