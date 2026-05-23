import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { mockClients } from "@/lib/mock-data";
import type { Client } from "@/lib/types";

export async function listClients(): Promise<Client[]> {
  if (isDemoMode) return mockClients;
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listClients", error);
    return [];
  }
  return (data as Client[]) ?? [];
}

export async function getClientById(id: string): Promise<Client | null> {
  if (isDemoMode) return mockClients.find((c) => c.id === id) ?? null;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getClientById", error);
    return null;
  }
  return (data as Client) ?? null;
}
