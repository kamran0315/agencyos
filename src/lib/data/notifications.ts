import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";
import { mockNotifications } from "@/lib/mock-data";
import type { Notification } from "@/lib/types";

export async function listNotifications(): Promise<Notification[]> {
  if (isDemoMode) return mockNotifications;
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data as Notification[]) ?? [];
}
