"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ClientFormDialog } from "./client-form-dialog";
import { deleteClientAction } from "@/lib/actions/clients";
import type { Client } from "@/lib/types";

export function ClientDetailActions({ client }: { client: Client }) {
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

      <ClientFormDialog client={client} open={editOpen} onOpenChange={setEditOpen} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${client.name}?`}
        description="This also deletes their projects, tasks, notes, and files. This cannot be undone."
        confirmLabel="Delete client"
        destructive
        successMessage="Client deleted"
        onConfirm={async () => {
          const r = await deleteClientAction(client.id);
          if (r.ok) router.push("/clients");
          return r;
        }}
      />
    </>
  );
}
