import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { mockProjects } from "@/lib/mock-data";
import type { Project } from "@/lib/types";

export async function listProjects(): Promise<Project[]> {
  if (isDemoMode) return mockProjects;
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listProjects", error);
    return [];
  }
  return (data as Project[]) ?? [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (isDemoMode) return mockProjects.find((p) => p.id === id) ?? null;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getProjectById", error);
    return null;
  }
  return (data as Project) ?? null;
}

export async function listProjectsByClient(clientId: string): Promise<Project[]> {
  if (isDemoMode) return mockProjects.filter((p) => p.client_id === clientId);
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as Project[]) ?? [];
}
