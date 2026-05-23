import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, Circle } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { mockNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const items = mockNotifications;
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Everything happening across your workspace."
      />
      <div className="p-6">
        {items.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up."
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {items.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.link ?? "#"}
                      className={cn(
                        "flex gap-3 px-6 py-4 transition-colors hover:bg-accent/40",
                        !n.read && "bg-accent/20"
                      )}
                    >
                      <Circle
                        className={cn(
                          "mt-1 size-2 shrink-0",
                          n.read
                            ? "fill-transparent text-muted-foreground/40"
                            : "fill-primary text-primary"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{n.title}</p>
                        {n.body && (
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {n.body}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(n.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
