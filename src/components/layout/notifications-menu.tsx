import Link from "next/link";
import { Bell, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listNotifications } from "@/lib/data/notifications";
import { cn } from "@/lib/utils";

export async function NotificationsMenu() {
  const items = await listNotifications();
  const unread = items.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-sm font-semibold">Notifications</span>
          <span className="text-xs text-muted-foreground">{unread} unread</span>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </div>
          ) : (
            items.map((n) => (
              <Link
                key={n.id}
                href={n.link ?? "#"}
                className={cn(
                  "flex gap-3 border-b border-border px-4 py-3 last:border-b-0 transition-colors hover:bg-accent/50",
                  !n.read && "bg-accent/30"
                )}
              >
                <Circle
                  className={cn(
                    "mt-1.5 size-2 shrink-0",
                    n.read
                      ? "fill-transparent text-muted-foreground/40"
                      : "fill-primary text-primary"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  {n.body && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {n.body}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" size="sm" className="w-full justify-center">
            <Link href="/notifications">View all</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
