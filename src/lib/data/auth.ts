import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";

/** Resolve the current user's id, or null. In demo mode returns a stub. */
export async function getUserId(): Promise<string | null> {
  if (isDemoMode) return "demo-user";
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/** Get full profile of the current user. */
export async function getProfile() {
  if (isDemoMode) {
    return {
      id: "demo-user",
      email: "demo@agencyos.app",
      full_name: "Demo User",
      avatar_url: null,
      role: "admin" as const,
    };
  }
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data;
}
