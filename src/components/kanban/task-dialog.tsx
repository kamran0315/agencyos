"use client";

import { useState } from "react";
import { Plus, Calendar as CalendarIcon, Paperclip } from "lucide-react";
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
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type Priority,
  type Task,
  type TaskStatus,
} from "@/lib/types";

interface Props {
  task?: Task;
  trigger?: React.ReactNode;
  defaultStatus?: TaskStatus;
  onSave?: (data: Partial<Task>) => void;
}

export function TaskDialog({ task, trigger, defaultStatus = "todo", onSave }: Props) {
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSave?.({
      title: String(form.get("title") ?? ""),
      description: String(form.get("description") ?? ""),
      status: form.get("status") as TaskStatus,
      priority: form.get("priority") as Priority,
      due_date: (form.get("due_date") as string) || null,
    });
    toast.success(task ? "Task updated" : "Task created", {
      description: "Demo mode — changes are kept in memory only.",
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="ghost" className="w-full justify-start">
            <Plus className="size-4" />
            Add task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update task details, status, or priority."
              : "Add a new task to this project's board."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={task?.title}
              required
              placeholder="What needs to happen?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={task?.description ?? ""}
              rows={3}
              placeholder="Optional context, acceptance criteria, links…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={task?.status ?? defaultStatus}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]).map(
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
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue={task?.priority ?? "medium"}>
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
              <Label htmlFor="due_date">
                <CalendarIcon className="size-3.5" /> Due date
              </Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                defaultValue={task?.due_date ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label>
                <Paperclip className="size-3.5" /> Attachment
              </Label>
              <Input type="file" disabled className="cursor-not-allowed" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Save changes" : "Create task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
