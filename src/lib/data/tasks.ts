import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { mockTasks } from "@/lib/mock-data";
import type { Task } from "@/lib/types";

export async function listTasks(): Promise<Task[]> {
  if (isDemoMode) return mockTasks;
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true });
  if (error) {
    console.error("listTasks", error);
    return [];
  }
  return (data as Task[]) ?? [];
}

export async function listTasksByProject(projectId: string): Promise<Task[]> {
  if (isDemoMode) return mockTasks.filter((t) => t.project_id === projectId);
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });
  if (error) return [];
  return (data as Task[]) ?? [];
}
