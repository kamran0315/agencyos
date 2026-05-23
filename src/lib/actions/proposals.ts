"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { getUserId } from "@/lib/data/auth";
import type { ProposalCategory } from "@/lib/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createProposalAction(
  formData: FormData
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/proposals");
    return { ok: true };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const ownerId = await getUserId();
  if (!ownerId) return { ok: false, error: "Not authenticated" };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) return { ok: false, error: "Title and body required" };

  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const { error } = await supabase.from("proposals").insert({
    owner_id: ownerId,
    title,
    body,
    category: (formData.get("category") as ProposalCategory) ?? "upwork",
    tags,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/proposals");
  return { ok: true };
}

export async function incrementProposalUseAction(id: string) {
  if (isDemoMode) return;
  const supabase = await createClient();
  if (!supabase) return;
  // Two-step: fetch + update. Fine for low traffic; replace with RPC if needed.
  const { data } = await supabase
    .from("proposals")
    .select("use_count")
    .eq("id", id)
    .maybeSingle();
  if (!data) return;
  await supabase
    .from("proposals")
    .update({ use_count: (data.use_count ?? 0) + 1 })
    .eq("id", id);
  revalidatePath("/proposals");
}
