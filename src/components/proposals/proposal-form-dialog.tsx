"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProposalAction,
  updateProposalAction,
} from "@/lib/actions/proposals";
import {
  PROPOSAL_CATEGORY_LABELS,
  type Proposal,
  type ProposalCategory,
} from "@/lib/types";

interface Props {
  trigger?: React.ReactNode;
  proposal?: Proposal;
  initialBody?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProposalFormDialog({
  trigger,
  proposal,
  initialBody,
  open: openProp,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [pending, startTransition] = useTransition();
  const [category, setCategory] = useState<ProposalCategory>(
    proposal?.category ?? "upwork"
  );
  const isEdit = !!proposal;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("category", category);
    startTransition(async () => {
      const result = isEdit
        ? await updateProposalAction(proposal.id, formData)
        : await createProposalAction(formData);
      if (result.ok) {
        toast.success(isEdit ? "Proposal updated" : "Proposal saved");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== undefined && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button>
              <Plus className="size-4" />
              New proposal
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit proposal" : "New proposal"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this template's content, tags, or category."
              : "Save a reusable template — Upwork, Fiverr, discovery, onboarding."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={proposal?.title ?? ""}
              placeholder="e.g. Upwork — Next.js marketing site rebuild"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ProposalCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PROPOSAL_CATEGORY_LABELS) as [ProposalCategory, string][]).map(
                    ([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={proposal?.tags.join(", ") ?? ""}
                placeholder="nextjs, sanity, marketing-site"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              name="body"
              required
              rows={12}
              defaultValue={proposal?.body ?? initialBody ?? ""}
              placeholder="The proposal copy. Use {{name}} or {{link}} as placeholders."
              className="font-mono text-xs"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : "Save proposal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
