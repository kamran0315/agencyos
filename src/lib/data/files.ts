import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { mockFiles } from "@/lib/mock-data";
import type { FileItem } from "@/lib/types";

export async function listFiles(): Promise<FileItem[]> {
  if (isDemoMode) return mockFiles;
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as FileItem[]) ?? [];
}

export async function listFilesByProject(projectId: string): Promise<FileItem[]> {
  if (isDemoMode) return mockFiles.filter((f) => f.project_id === projectId);
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("project_id", projectId);
  if (error) return [];
  return (data as FileItem[]) ?? [];
}

export async function listFilesByClient(clientId: string): Promise<FileItem[]> {
  if (isDemoMode) return mockFiles.filter((f) => f.client_id === clientId);
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("client_id", clientId);
  if (error) return [];
  return (data as FileItem[]) ?? [];
}
