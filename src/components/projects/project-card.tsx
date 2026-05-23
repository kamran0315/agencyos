"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isBefore, parseISO } from "date-fns";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  ProjectStatusBadge,
  PriorityBadge,
} from "@/components/common/status-badge";
import { ProjectFormDialog } from "./project-form-dialog";
import { deleteProjectAction } from "@/lib/actions/projects";
import type { Client, Project } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

export function ProjectCard({
  project,
  client,
  clients,
}: {
  project: Project;
  client: Client | null;
  clients: Client[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const due = project.deadline ? parseISO(project.deadline) : null;
  const overdue = due
    ? isBefore(due, new Date()) && project.status !== "completed"
    : false;

  return (
    <>
      <Card className="h-full gap-4 transition-shadow hover:shadow-md">
        <div className="px-6">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/projects/${project.id}`} className="min-w-0 group">
              <p className="truncate text-sm font-semibold group-hover:underline">
                {project.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {client?.company ?? client?.name ?? "No client"}
              </p>
            </Link>
            <div className="flex items-start gap-1">
              <PriorityBadge priority={project.priority} />
              <RowActions>
                <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                  <Edit2 className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </RowActions>
            </div>
          </div>
          {project.description && (
            <Link
              href={`/projects/${project.id}`}
              className="mt-2 block line-clamp-2 text-xs text-muted-foreground"
            >
              {project.description}
            </Link>
          )}
        </div>
        <Link href={`/projects/${project.id}`} className="block px-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </Link>
        <div className="flex items-center justify-between border-t border-border px-6 pt-3">
          <ProjectStatusBadge status={project.status} />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {project.budget && <span>{formatCurrency(project.budget)}</span>}
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

      <ProjectFormDialog
        project={project}
        clients={clients}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${project.title}"?`}
        description="This also deletes all of its tasks. This cannot be undone."
        confirmLabel="Delete project"
        destructive
        successMessage="Project deleted"
        onConfirm={() => deleteProjectAction(project.id)}
      />
    </>
  );
}
