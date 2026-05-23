import Link from "next/link";
import { formatDistanceToNow, format, isBefore, parseISO } from "date-fns";
import {
  Briefcase,
  DollarSign,
  Users,
  CheckCheck,
  ArrowRight,
  Calendar,
  Circle,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge } from "@/components/common/status-badge";
import { listProjects } from "@/lib/data/projects";
import { listClients } from "@/lib/data/clients";
import { listTasks } from "@/lib/data/tasks";
import { listNotifications } from "@/lib/data/notifications";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const [projects, clients, tasks, notifications] = await Promise.all([
    listProjects(),
    listClients(),
    listTasks(),
    listNotifications(),
  ]);

  const clientById = Object.fromEntries(clients.map((c) => [c.id, c]));
  const activeProjects = projects.filter(
    (p) => p.status === "in_progress" || p.status === "revision"
  );
  const pendingTasks = tasks.filter((t) => t.status !== "done");
  const totalRevenue = projects.reduce((s, p) => s + (p.budget ?? 0), 0);
  const upcomingDeadlines = [...projects]
    .filter((p) => p.deadline && p.status !== "completed" && p.status !== "cancelled")
    .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="What's happening across your agency today."
      >
        <Button asChild>
          <Link href="/projects">New project</Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 p-6 lg:grid-cols-4">
        <StatCard
          label="Active projects"
          value={activeProjects.length}
          icon={Briefcase}
          trend={12}
          hint="vs last month"
        />
        <StatCard
          label="Total clients"
          value={clients.length}
          icon={Users}
          trend={8}
          hint="vs last month"
        />
        <StatCard
          label="Pending tasks"
          value={pendingTasks.length}
          icon={CheckCheck}
          trend={-4}
          hint="vs last week"
        />
        <StatCard
          label="Pipeline value"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          trend={22}
          hint="vs last quarter"
        />
      </div>

      <div className="grid gap-4 px-6 pb-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Last 6 months of project value</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming deadlines</CardTitle>
            <CardDescription>Next 5 projects due</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
            )}
            {upcomingDeadlines.map((p) => {
              const client = p.client_id ? clientById[p.client_id] : null;
              const due = p.deadline ? parseISO(p.deadline) : null;
              const overdue = due ? isBefore(due, new Date()) : false;
              return (
                <Link key={p.id} href={`/projects/${p.id}`} className="block group">
                  <div className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Calendar className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium group-hover:text-foreground">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {client?.company ?? client?.name ?? "No client"}
                      </p>
                    </div>
                    <span
                      className={
                        "text-xs font-medium " +
                        (overdue ? "text-destructive" : "text-muted-foreground")
                      }
                    >
                      {due ? format(due, "MMM d") : "—"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 px-6 pb-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active projects</CardTitle>
              <CardDescription>In progress or awaiting revision</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/projects">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No active projects yet — create your first one to get started.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {activeProjects.map((p) => {
                  const client = p.client_id ? clientById[p.client_id] : null;
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/projects/${p.id}`}
                        className="flex items-center gap-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{p.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {client?.company ?? "—"}
                          </p>
                        </div>
                        <div className="hidden text-xs text-muted-foreground sm:block w-24">
                          {p.progress}% complete
                        </div>
                        <ProjectStatusBadge status={p.status} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Across all projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing yet.</p>
            )}
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex gap-2.5">
                <Circle className="mt-1 size-2 shrink-0 fill-muted-foreground text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{n.title}</p>
                  {n.body && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {n.body}
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
