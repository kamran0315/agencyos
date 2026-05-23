"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { KanbanCard } from "./kanban-card";
import { TaskDialog } from "./task-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TASK_STATUS_LABELS, type Task, type TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  status: TaskStatus;
  tasks: Task[];
  projectId: string;
}

const statusAccent: Record<TaskStatus, string> = {
  todo: "bg-zinc-400",
  in_progress: "bg-blue-500",
  review: "bg-amber-500",
  done: "bg-emerald-500",
};

export function KanbanColumn({ status, tasks, projectId }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 rounded-full", statusAccent[status])} />
          <span className="text-sm font-semibold">
            {TASK_STATUS_LABELS[status]}
          </span>
          <Badge variant="secondary" className="h-5">
            {tasks.length}
          </Badge>
        </div>
        <TaskDialog
          projectId={projectId}
          defaultStatus={status}
          trigger={
            <Button variant="ghost" size="icon" className="size-7">
              <Plus className="size-3.5" />
            </Button>
          }
        />
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2 rounded-lg border border-dashed border-transparent p-1 transition-colors min-h-32",
          isOver && "border-border bg-accent/30"
        )}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} projectId={projectId} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  );
}
