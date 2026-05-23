"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { getUserId } from "@/lib/data/auth";
import type { Priority, ProjectStatus } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createProjectAction(
  formData: FormData
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/projects");
    return { ok: true };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const ownerId = await getUserId();
  if (!ownerId) return { ok: false, error: "Not authenticated" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Title is required" };

  const budgetRaw = String(formData.get("budget") ?? "").trim();
  const { error } = await supabase.from("projects").insert({
    owner_id: ownerId,
    title,
    client_id: emptyToNull(formData.get("client")),
    status: (formData.get("status") as ProjectStatus) ?? "discussion",
    priority: (formData.get("priority") as Priority) ?? "medium",
    budget: budgetRaw ? Number(budgetRaw) : null,
    deadline: emptyToNull(formData.get("deadline")),
    description: emptyToNull(formData.get("description")),
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateProjectAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    return { ok: true };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Title is required" };

  const budgetRaw = String(formData.get("budget") ?? "").trim();
  const progressRaw = String(formData.get("progress") ?? "").trim();

  const update: Record<string, unknown> = {
    title,
    client_id: emptyToNull(formData.get("client")),
    status: formData.get("status") as ProjectStatus,
    priority: formData.get("priority") as Priority,
    budget: budgetRaw ? Number(budgetRaw) : null,
    deadline: emptyToNull(formData.get("deadline")),
    description: emptyToNull(formData.get("description")),
  };
  if (progressRaw !== "") update.progress = Number(progressRaw);

  const { error } = await supabase.from("projects").update(update).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/projects");
    return { ok: true };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteProjectAndRedirect(id: string) {
  const result = await deleteProjectAction(id);
  if (result.ok) redirect("/projects");
  return result;
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}
