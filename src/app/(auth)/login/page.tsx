import { LoginForm } from "./login-form";
import { isDemoMode } from "@/lib/supabase/config";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-foreground text-background font-semibold">
            A
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your AgencyOS workspace
          </p>
        </div>

        <LoginForm demoMode={isDemoMode} />

        {isDemoMode && (
          <p className="text-center text-xs text-muted-foreground">
            Demo mode — any email/password works.
          </p>
        )}
      </div>
    </div>
  );
}
