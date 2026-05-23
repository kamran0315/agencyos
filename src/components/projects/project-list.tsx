"use client";

import { useMemo, useState } from "react";
import { FolderKanban, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/empty-state";
import { ProjectCard } from "./project-card";
import { ProjectFormDialog } from "./project-form-dialog";
import {
  PROJECT_STATUS_LABELS,
  type Project,
  type ProjectStatus,
  type Priority,
  type Client,
} from "@/lib/types";

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
          action={<ProjectFormDialog clients={clients} />}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              client={p.client_id ? clientById[p.client_id] : null}
              clients={clients}
            />
          ))}
        </div>
      )}
    </div>
  );
}
