"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import type { Priority, TaskStatus } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createTaskAction(
  projectId: string,
  formData: FormData
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath(`/projects/${projectId}`);
    return { ok: true };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Title is required" };

  const status = (formData.get("status") as TaskStatus) ?? "todo";

  const { data: maxRow } = await supabase
    .from("tasks")
    .select("position")
    .eq("project_id", projectId)
    .eq("status", status)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPos = (maxRow?.position ?? -1) + 1;

  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    title,
    description: emptyToNull(formData.get("description")),
    status,
    priority: (formData.get("priority") as Priority) ?? "medium",
    due_date: emptyToNull(formData.get("due_date")),
    position: nextPos,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/tasks");
  return { ok: true };
}

export async function updateTaskAction(
  taskId: string,
  projectId: string,
  formData: FormData
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath(`/projects/${projectId}`);
    return { ok: true };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("tasks")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      description: emptyToNull(formData.get("description")),
      status: formData.get("status") as TaskStatus,
      priority: formData.get("priority") as Priority,
      due_date: emptyToNull(formData.get("due_date")),
    })
    .eq("id", taskId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/tasks");
  return { ok: true };
}

export async function moveTaskAction(
  taskId: string,
  newStatus: TaskStatus,
  newPosition: number
): Promise<ActionResult> {
  if (isDemoMode) return { ok: true };
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("tasks")
    .update({ status: newStatus, position: newPosition })
    .eq("id", taskId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}
