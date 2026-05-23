"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ProjectFormDialog } from "./project-form-dialog";
import { deleteProjectAction } from "@/lib/actions/projects";
import type { Client, Project } from "@/lib/types";

export function ProjectDetailActions({
  project,
  clients,
}: {
  project: Project;
  clients: Client[];
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        <Edit2 className="size-4" />
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="size-4" />
        Delete
      </Button>

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
        onConfirm={async () => {
          const r = await deleteProjectAction(project.id);
          if (r.ok) router.push("/projects");
          return r;
        }}
      />
    </>
  );
}
