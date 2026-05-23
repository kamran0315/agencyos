"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/supabase/config";

export type AuthState = { error?: string } | undefined;

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (isDemoMode) {
    // Demo mode: any creds work, redirect straight in.
    redirect("/dashboard");
  }

  const supabase = await createClient();
  if (!supabase) redirect("/dashboard");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}
