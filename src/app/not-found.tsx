import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-6xl font-semibold tracking-tight">404</div>
      <p className="max-w-sm text-muted-foreground">
        We couldn&apos;t find that page. It may have moved or never existed.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
