"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { getUserId } from "@/lib/data/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

export type RecordUploadPayload = {
  name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  project_id?: string | null;
  client_id?: string | null;
};

/** Insert metadata row after the browser uploads the file to Storage. */
export async function recordUploadedFileAction(
  payload: RecordUploadPayload
): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/files");
    return { ok: true };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const ownerId = await getUserId();
  if (!ownerId) return { ok: false, error: "Not authenticated" };

  const { error } = await supabase.from("files").insert({
    owner_id: ownerId,
    name: payload.name,
    storage_path: payload.storage_path,
    mime_type: payload.mime_type,
    size_bytes: payload.size_bytes,
    project_id: payload.project_id ?? null,
    client_id: payload.client_id ?? null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/files");
  if (payload.project_id) revalidatePath(`/projects/${payload.project_id}`);
  if (payload.client_id) revalidatePath(`/clients/${payload.client_id}`);
  return { ok: true };
}

export async function deleteFileAction(id: string): Promise<ActionResult> {
  if (isDemoMode) {
    revalidatePath("/files");
    return { ok: true };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  // Look up storage_path so we can also remove the binary.
  const { data: row, error: lookupErr } = await supabase
    .from("files")
    .select("storage_path, project_id, client_id")
    .eq("id", id)
    .maybeSingle();
  if (lookupErr) return { ok: false, error: lookupErr.message };

  if (row?.storage_path) {
    const { error: storageErr } = await supabase.storage
      .from("files")
      .remove([row.storage_path]);
    if (storageErr) return { ok: false, error: storageErr.message };
  }

  const { error: deleteErr } = await supabase.from("files").delete().eq("id", id);
  if (deleteErr) return { ok: false, error: deleteErr.message };

  revalidatePath("/files");
  if (row?.project_id) revalidatePath(`/projects/${row.project_id}`);
  if (row?.client_id) revalidatePath(`/clients/${row.client_id}`);
  return { ok: true };
}

/** Return a short-lived signed URL for the browser to download. */
export async function getSignedDownloadUrl(
  id: string
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (isDemoMode) {
    return { ok: false, error: "Demo mode — no real file to download." };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const { data: row, error: rowErr } = await supabase
    .from("files")
    .select("storage_path, name")
    .eq("id", id)
    .maybeSingle();
  if (rowErr || !row) {
    return { ok: false, error: rowErr?.message ?? "File not found" };
  }

  const { data, error } = await supabase.storage
    .from("files")
    .createSignedUrl(row.storage_path, 60, { download: row.name });
  if (error || !data?.signedUrl) {
    return { ok: false, error: error?.message ?? "Could not sign URL" };
  }
  return { ok: true, url: data.signedUrl };
}
