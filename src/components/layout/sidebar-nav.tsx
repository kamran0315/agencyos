"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  StickyNote,
  FileText,
  Bell,
  FolderOpen,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/lib/mock-data";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/proposals", label: "Proposals", icon: FileText },
  { href: "/files", label: "Files", icon: FolderOpen },
] as const;

const bottomItems = [
  { href: "/ai", label: "AI Tools", icon: Sparkles },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  const unread = mockNotifications.filter((n) => !n.read).length;

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background text-sm font-semibold">
          A
        </div>
        <span className="font-semibold tracking-tight">AgencyOS</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={
                pathname === item.href || pathname.startsWith(item.href + "/")
              }
            />
          ))}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3 space-y-0.5">
        {bottomItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            badge={item.href === "/notifications" && unread > 0 ? unread : undefined}
            active={
              pathname === item.href || pathname.startsWith(item.href + "/")
            }
          />
        ))}
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: number;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
      >
        <Icon className="size-4" />
        <span className="flex-1">{label}</span>
        {badge ? (
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
            {badge}
          </Badge>
        ) : null}
      </Link>
    </li>
  );
}
