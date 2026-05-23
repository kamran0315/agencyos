"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { getUserId } from "@/lib/data/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createClientAction(
  formData: FormData
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/clients");
    return { ok: true };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const ownerId = await getUserId();
  if (!ownerId) return { ok: false, error: "Not authenticated" };

  const payload = {
    owner_id: ownerId,
    name: String(formData.get("name") ?? "").trim(),
    company: emptyToNull(formData.get("company")),
    email: emptyToNull(formData.get("email")),
    phone: emptyToNull(formData.get("phone")),
    upwork_url: emptyToNull(formData.get("upwork")),
    fiverr_url: emptyToNull(formData.get("fiverr")),
    website: emptyToNull(formData.get("website")),
    notes: emptyToNull(formData.get("notes")),
  };
  if (!payload.name) return { ok: false, error: "Name is required" };

  const { error } = await supabase.from("clients").insert(payload);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateClientAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { ok: true };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Name is required" };

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      company: emptyToNull(formData.get("company")),
      email: emptyToNull(formData.get("email")),
      phone: emptyToNull(formData.get("phone")),
      upwork_url: emptyToNull(formData.get("upwork")),
      fiverr_url: emptyToNull(formData.get("fiverr")),
      website: emptyToNull(formData.get("website")),
      notes: emptyToNull(formData.get("notes")),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  return { ok: true };
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/clients");
    return { ok: true };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/clients");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteClientAndRedirect(id: string) {
  const result = await deleteClientAction(id);
  if (result.ok) redirect("/clients");
  return result;
}

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}
