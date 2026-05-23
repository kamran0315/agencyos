"use client";

import { useState } from "react";
import { Copy, Edit2, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { RowActions } from "@/components/common/row-actions";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ProposalFormDialog } from "./proposal-form-dialog";
import {
  deleteProposalAction,
  incrementProposalUseAction,
} from "@/lib/actions/proposals";
import {
  PROPOSAL_CATEGORY_LABELS,
  type Proposal,
} from "@/lib/types";

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function copy() {
    navigator.clipboard.writeText(proposal.body);
    toast.success("Copied to clipboard");
    void incrementProposalUseAction(proposal.id);
  }

  return (
    <>
      <Card className="gap-3 transition-shadow hover:shadow-md">
        <CardContent className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-sm">{proposal.title}</p>
              <p className="text-xs text-muted-foreground">
                Used {proposal.use_count}×
              </p>
            </div>
            <div className="flex items-start gap-1">
              <Badge variant="secondary" className="capitalize">
                {PROPOSAL_CATEGORY_LABELS[proposal.category]}
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
          <pre className="line-clamp-4 whitespace-pre-wrap font-sans text-xs text-muted-foreground">
            {proposal.body}
          </pre>
          {proposal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {proposal.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  <Tag className="size-2.5" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <div className="border-t border-border px-6 pt-3">
          <Button size="sm" variant="ghost" className="w-full" onClick={copy}>
            <Copy className="size-3.5" />
            Copy proposal
          </Button>
        </div>
      </Card>

      <ProposalFormDialog
        proposal={proposal}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${proposal.title}"?`}
        description="This template will be permanently removed."
        confirmLabel="Delete proposal"
        destructive
        successMessage="Proposal deleted"
        onConfirm={() => deleteProposalAction(proposal.id)}
      />
    </>
  );
}
