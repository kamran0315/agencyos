"use client";

import { useState } from "react";
import { Edit2, Pin, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { NoteFormDialog } from "./note-form-dialog";
import { deleteNoteAction } from "@/lib/actions/notes";
import { NOTE_CATEGORY_LABELS, type Note } from "@/lib/types";

export function NoteCard({ note }: { note: Note }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="gap-2 transition-shadow hover:shadow-md">
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold flex items-center gap-1.5">
                {note.pinned && <Pin className="size-3 text-muted-foreground" />}
                {note.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Updated {format(new Date(note.updated_at), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex items-start gap-1">
              <Badge variant="secondary" className="capitalize">
                {NOTE_CATEGORY_LABELS[note.category]}
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
          </div>
          {note.body && (
            <p className="line-clamp-4 whitespace-pre-wrap text-xs text-muted-foreground">
              {note.body}
            </p>
          )}
        </CardContent>
      </Card>

      <NoteFormDialog note={note} open={editOpen} onOpenChange={setEditOpen} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${note.title}"?`}
        description="This note will be permanently removed."
        confirmLabel="Delete note"
        destructive
        successMessage="Note deleted"
        onConfirm={() => deleteNoteAction(note.id)}
      />
    </>
  );
}
