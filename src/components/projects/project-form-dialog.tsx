"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockClients } from "@/lib/mock-data";
import {
  PRIORITY_LABELS,
  PROJECT_STATUS_LABELS,
  type Priority,
  type ProjectStatus,
} from "@/lib/types";

export function ProjectFormDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Project created", {
      description: "Demo mode — no record was persisted.",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="size-4" />
            New project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Set the basics now. You can add tasks and notes after creation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project title</Label>
            <Input id="title" required placeholder="e.g. Marketing site rebuild" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select>
              <SelectTrigger id="client" className="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                    {c.company ? ` — ${c.company}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="discussion">
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PROJECT_STATUS_LABELS) as [
                    ProjectStatus,
                    string
                  ][]).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PRIORITY_LABELS) as [Priority, string][]).map(
                    ([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input id="budget" type="number" placeholder="5000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="What's the goal of this project?"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
