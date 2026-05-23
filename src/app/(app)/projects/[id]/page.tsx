import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, CircleDollarSign, User } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge, PriorityBadge } from "@/components/common/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { getProjectById } from "@/lib/data/projects";
import { getClientById } from "@/lib/data/clients";
import { listTasksByProject } from "@/lib/data/tasks";
import { listNotesByProject } from "@/lib/data/notes";
import { listFilesByProject } from "@/lib/data/files";
import { formatCurrency } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const [client, tasks, notes, files] = await Promise.all([
    project.client_id ? getClientById(project.client_id) : Promise.resolve(null),
    listTasksByProject(project.id),
    listNotesByProject(project.id),
    listFilesByProject(project.id),
  ]);

  return (
    <div>
      <PageHeader title={project.title} description={client?.company ?? client?.name ?? undefined}>
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects">
            <ArrowLeft className="size-4" />
            All projects
          </Link>
        </Button>
        <TaskDialog projectId={project.id} />
      </PageHeader>

      <div className="grid gap-4 p-6 lg:grid-cols-4">
        <Card className="gap-2 py-4">
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Status</p>
            <ProjectStatusBadge status={project.status} />
          </CardContent>
        </Card>
        <Card className="gap-2 py-4">
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Priority</p>
            <PriorityBadge priority={project.priority} />
          </CardContent>
        </Card>
        <Card className="gap-2 py-4">
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-sm font-semibold inline-flex items-center gap-1">
              <CircleDollarSign className="size-3.5 text-muted-foreground" />
              {project.budget ? formatCurrency(project.budget) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card className="gap-2 py-4">
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Deadline</p>
            <p className="text-sm font-semibold inline-flex items-center gap-1">
              <Calendar className="size-3.5 text-muted-foreground" />
              {project.deadline
                ? format(new Date(project.deadline), "MMM d, yyyy")
                : "Not set"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-3">
            <h3 className="text-sm font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {project.description ?? "No description yet."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <h3 className="text-sm font-semibold">Progress</h3>
            <Progress value={project.progress} />
            <p className="text-xs text-muted-foreground">
              {project.progress}% complete · {tasks.filter((t) => t.status === "done").length}/
              {tasks.length} tasks done
            </p>
            {client && (
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">Client</p>
                <Link
                  href={`/clients/${client.id}`}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                >
                  <User className="size-3.5" />
                  {client.name}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-8">
        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="mt-4">
            <KanbanBoard projectId={project.id} initialTasks={tasks} />
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardContent className="space-y-3">
                {notes.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No notes for this project yet.
                  </p>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {n.category}
                        </p>
                      </div>
                      {n.body && (
                        <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                          {n.body}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <Card>
              <CardContent>
                {files.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No files uploaded.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {files.map((f) => (
                      <li key={f.id} className="flex items-center justify-between py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{f.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {f.size_bytes
                              ? (f.size_bytes / 1024 / 1024).toFixed(2) + " MB"
                              : ""}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
