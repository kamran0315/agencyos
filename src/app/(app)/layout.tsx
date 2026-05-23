import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";
import { listNotifications } from "@/lib/data/notifications";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = await listNotifications();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav unreadCount={unread} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
