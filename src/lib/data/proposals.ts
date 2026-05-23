import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { mockProposals } from "@/lib/mock-data";
import type { Proposal } from "@/lib/types";

export async function listProposals(): Promise<Proposal[]> {
  if (isDemoMode) return mockProposals;
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as Proposal[]) ?? [];
}
