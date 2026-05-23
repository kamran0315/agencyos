"use client";

import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/supabase/config";

const STORAGE_BUCKET = "files";

export type UploadResult =
  | { ok: true; storage_path: string }
  | { ok: false; error: string };

/**
 * Upload a single file directly from the browser to Supabase Storage.
 * Path convention: <auth.uid>/<crypto-uuid>-<file.name>
 * RLS policy in 0002_storage.sql allows the user to write only under their own prefix.
 */
export async function uploadFileToStorage(
  file: File,
  ownerId: string
): Promise<UploadResult> {
  if (isDemoMode) {
    // Pretend it worked so the UI can still show a creation flow.
    return { ok: true, storage_path: `demo/${file.name}` };
  }

  const supabase = createClient();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${ownerId}/${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (error) return { ok: false, error: error.message };
  return { ok: true, storage_path: path };
}
