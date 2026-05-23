"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isDemoMode } from "./config";

export function createClient() {
  if (isDemoMode) {
    // Return a stub that won't be called in demo mode (UI uses mock data).
    return null;
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
