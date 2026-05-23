"use client";

import { useState, useTransition } from "react";
import { Plus, Calendar as CalendarIcon, Trash2 } from "lucide-react";
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
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import {
  createTaskAction,
  deleteTaskAction,
  updateTaskAction,
} from "@/lib/actions/tasks";
import {
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type Priority,
  type Task,
  type TaskStatus,
} from "@/lib/types";

interface Props {
  projectId: string;
  task?: Task;
  trigger?: React.ReactNode;
  defaultStatus?: TaskStatus;
}

export function TaskDialog({ projectId, task, trigger, defaultStatus = "todo" }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? defaultStatus);
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "medium");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("status", status);
    formData.set("priority", priority);
    startTransition(async () => {
      const result = task
        ? await updateTaskAction(task.id, projectId, formData)
        : await createTaskAction(projectId, formData);
      if (result.ok) {
        toast.success(task ? "Task updated" : "Task created");
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <Plus className="size-4" />
            New task
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
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="w-full">
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
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="w-full">
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
          <DialogFooter className="sm:justify-between">
            <div>
              {task && (
                <ConfirmDialog
                  trigger={
                    <Button type="button" variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  }
                  title={`Delete "${task.title}"?`}
                  description="This task will be permanently removed."
                  confirmLabel="Delete task"
                  destructive
                  successMessage="Task deleted"
                  onConfirm={async () => {
                    const r = await deleteTaskAction(task.id, projectId);
                    if (r.ok) setOpen(false);
                    return r;
                  }}
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : task ? "Save changes" : "Create task"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
