"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, isBefore, parseISO } from "date-fns";
import { Calendar, FolderKanban, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/empty-state";
import { ProjectStatusBadge, PriorityBadge } from "@/components/common/status-badge";
import {
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectStatus,
  type Priority,
  type Client,
} from "@/lib/types";
import { ProjectFormDialog } from "./project-form-dialog";
import { cn, formatCurrency } from "@/lib/utils";

interface Props {
  projects: Project[];
  clients: Client[];
}

export function ProjectList({ projects, clients }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");

  const clientById = useMemo(
    () => Object.fromEntries(clients.map((c) => [c.id, c])),
    [clients]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (priority !== "all" && p.priority !== priority) return false;
      if (query) {
        const q = query.toLowerCase();
        const client = p.client_id ? clientById[p.client_id] : undefined;
        const hay = [p.title, p.description ?? "", client?.name ?? "", client?.company ?? ""]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [projects, status, priority, query, clientById]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus | "all")}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(Object.entries(PROJECT_STATUS_LABELS) as [ProjectStatus, string][]).map(
                ([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority | "all")}>
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects match"
          description="Try clearing the filters or create a new project."
          action={<ProjectFormDialog />}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const client = p.client_id ? clientById[p.client_id] : null;
            const due = p.deadline ? parseISO(p.deadline) : null;
            const overdue = due ? isBefore(due, new Date()) && p.status !== "completed" : false;
            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="block">
                <Card className="h-full gap-4 transition-shadow hover:shadow-md">
                  <div className="px-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{p.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {client?.company ?? client?.name ?? "No client"}
                        </p>
                      </div>
                      <PriorityBadge priority={p.priority} />
                    </div>
                    {p.description && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <div className="px-6 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} />
                  </div>
                  <div className="flex items-center justify-between border-t border-border px-6 pt-3">
                    <ProjectStatusBadge status={p.status} />
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {p.budget && <span>{formatCurrency(p.budget)}</span>}
                      {due && (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1",
                            overdue && "text-destructive font-medium"
                          )}
                        >
                          <Calendar className="size-3.5" />
                          {format(due, "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
