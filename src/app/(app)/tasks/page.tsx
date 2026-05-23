import Link from "next/link";
import { format } from "date-fns";
import { CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { mockProjects, mockTasks } from "@/lib/mock-data";
import { TASK_STATUS_LABELS } from "@/lib/types";

export default function TasksPage() {
  const grouped = {
    todo: mockTasks.filter((t) => t.status === "todo"),
    in_progress: mockTasks.filter((t) => t.status === "in_progress"),
    review: mockTasks.filter((t) => t.status === "review"),
    done: mockTasks.filter((t) => t.status === "done"),
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="All tasks across every project, grouped by status."
      />
      <div className="grid gap-4 p-6 lg:grid-cols-2">
        {(Object.entries(grouped) as [keyof typeof grouped, typeof mockTasks][]).map(
          ([status, tasks]) => (
            <Card key={status}>
              <CardContent>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {TASK_STATUS_LABELS[status]}
                  </h3>
                  <Badge variant="secondary">{tasks.length}</Badge>
                </div>
                {tasks.length === 0 ? (
                  <EmptyState
                    icon={CheckSquare}
                    title="Nothing here yet"
                    className="border-0 p-6"
                  />
                ) : (
                  <ul className="space-y-2">
                    {tasks.map((t) => {
                      const project = mockProjects.find((p) => p.id === t.project_id);
                      return (
                        <li key={t.id}>
                          <Link
                            href={`/projects/${t.project_id}`}
                            className="flex items-start justify-between gap-3 rounded-md border border-border p-3 transition-colors hover:bg-accent/40"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {t.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {project?.title}
                                {t.due_date &&
                                  ` · due ${format(new Date(t.due_date), "MMM d")}`}
                              </p>
                            </div>
                            <PriorityBadge priority={t.priority} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
