"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MessageSquare, Paperclip } from "lucide-react";
import { format, isBefore, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/common/status-badge";
import { TaskDialog } from "./task-dialog";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

export function KanbanCard({
  task,
  projectId,
}: {
  task: Task;
  projectId: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const due = task.due_date ? parseISO(task.due_date) : null;
  const overdue = due ? isBefore(due, new Date()) && task.status !== "done" : false;

  return (
    <TaskDialog
      projectId={projectId}
      task={task}
      trigger={
        <div
          ref={setNodeRef}
          style={style}
          className={cn("touch-none select-none", isDragging && "opacity-50")}
          {...attributes}
          {...listeners}
        >
          <Card className="cursor-grab gap-2 py-3 active:cursor-grabbing transition-shadow hover:shadow-md">
            <div className="px-4">
              <p className="text-sm font-medium leading-snug">{task.title}</p>
              {task.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 px-4">
              <PriorityBadge priority={task.priority} />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {due && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      overdue && "text-destructive font-medium"
                    )}
                  >
                    <Calendar className="size-3" />
                    {format(due, "MMM d")}
                  </span>
                )}
                <MessageSquare className="size-3" />
                <Paperclip className="size-3" />
              </div>
            </div>
          </Card>
        </div>
      }
    />
  );
}
