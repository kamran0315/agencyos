import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { mockNotes } from "@/lib/mock-data";
import type { Note } from "@/lib/types";

export async function listNotes(): Promise<Note[]> {
  if (isDemoMode) return mockNotes;
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data as Note[]) ?? [];
}

export async function listNotesByProject(projectId: string): Promise<Note[]> {
  if (isDemoMode) return mockNotes.filter((n) => n.project_id === projectId);
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data as Note[]) ?? [];
}

export async function listNotesByClient(clientId: string): Promise<Note[]> {
  if (isDemoMode) return mockNotes.filter((n) => n.client_id === clientId);
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("client_id", clientId)
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data as Note[]) ?? [];
}
