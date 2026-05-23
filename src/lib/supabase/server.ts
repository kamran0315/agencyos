import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isDemoMode } from "./config";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

export async function createClient() {
  if (isDemoMode) return null;
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet: CookieToSet[]) {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // No-op in Server Components.
        }
      },
    },
  });
}
