"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { getUserId } from "@/lib/data/auth";
import type {
  Priority,
  ProjectStatus,
} from "@/lib/types";

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
  const payload = {
    owner_id: ownerId,
    title,
    client_id: emptyToNull(formData.get("client")),
    status: (formData.get("status") as ProjectStatus) ?? "discussion",
    priority: (formData.get("priority") as Priority) ?? "medium",
    budget: budgetRaw ? Number(budgetRaw) : null,
    deadline: emptyToNull(formData.get("deadline")),
    description: emptyToNull(formData.get("description")),
  };

  const { error } = await supabase.from("projects").insert(payload);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { ok: true };
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}
