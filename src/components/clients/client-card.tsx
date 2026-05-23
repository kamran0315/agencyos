"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit2, Mail, Phone, ExternalLink, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ClientFormDialog } from "./client-form-dialog";
import { deleteClientAction } from "@/lib/actions/clients";
import type { Client } from "@/lib/types";
import { getInitials, truncate } from "@/lib/utils";

export function ClientCard({
  client,
  projectCount,
}: {
  client: Client;
  projectCount: number;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="group gap-3 transition-shadow hover:shadow-md">
        <div className="px-6">
          <div className="flex items-start gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-muted text-foreground">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <Link
                href={`/clients/${client.id}`}
                className="text-sm font-semibold hover:underline"
              >
                {client.name}
              </Link>
              {client.company && (
                <p className="text-xs text-muted-foreground">{client.company}</p>
              )}
            </div>
            <Badge variant="secondary">
              {projectCount} project{projectCount === 1 ? "" : "s"}
            </Badge>
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
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            {client.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5" />
                <span className="truncate">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.website && (
              <div className="flex items-center gap-1.5">
                <ExternalLink className="size-3.5" />
                <span className="truncate">{client.website}</span>
              </div>
            )}
          </div>
          {client.notes && (
            <p className="mt-3 line-clamp-2 text-xs text-muted-foreground border-t border-border pt-3">
              {truncate(client.notes, 140)}
            </p>
          )}
        </div>
        <div className="border-t border-border px-6 pt-3">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href={`/clients/${client.id}`}>View details</Link>
          </Button>
        </div>
      </Card>

      <ClientFormDialog client={client} open={editOpen} onOpenChange={setEditOpen} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${client.name}?`}
        description="This also deletes their projects, tasks, notes, and files. This cannot be undone."
        confirmLabel="Delete client"
        destructive
        successMessage="Client deleted"
        onConfirm={() => deleteClientAction(client.id)}
      />
    </>
  );
}
