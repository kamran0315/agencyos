export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when env vars are not configured — the app falls back to mock data. */
export const isDemoMode = !SUPABASE_URL || !SUPABASE_ANON_KEY;
