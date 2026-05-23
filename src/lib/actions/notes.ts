"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { getUserId } from "@/lib/data/auth";
import type { NoteCategory } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createNoteAction(
  formData: FormData
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/notes");
    return { ok: true };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const ownerId = await getUserId();
  if (!ownerId) return { ok: false, error: "Not authenticated" };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, error: "Title is required" };

  const { error } = await supabase.from("notes").insert({
    owner_id: ownerId,
    title,
    body: emptyToNull(formData.get("body")),
    category: (formData.get("category") as NoteCategory) ?? "internal",
    project_id: emptyToNull(formData.get("project_id")),
    client_id: emptyToNull(formData.get("client_id")),
    pinned: formData.get("pinned") === "on",
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/notes");
  return { ok: true };
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}
