"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { type Task, type TaskStatus } from "@/lib/types";

const STATUSES: TaskStatus[] = ["todo", "in_progress", "review", "done"];

export function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    for (const t of tasks) map[t.status].push(t);
    for (const s of STATUSES) map[s].sort((a, b) => a.position - b.position);
    return map;
  }, [tasks]);

  function findTaskColumn(id: string): TaskStatus | null {
    if ((STATUSES as string[]).includes(id)) return id as TaskStatus;
    const t = tasks.find((x) => x.id === id);
    return t?.status ?? null;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const fromCol = findTaskColumn(activeId);
    const toCol = findTaskColumn(overId);
    if (!fromCol || !toCol || fromCol === toCol) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, status: toCol } : t))
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const fromCol = findTaskColumn(activeId);
    const toCol = findTaskColumn(overId);
    if (!fromCol || !toCol) return;

    setTasks((prev) => {
      const colTasks = prev
        .filter((t) => t.status === toCol)
        .sort((a, b) => a.position - b.position);
      const activeIndex = colTasks.findIndex((t) => t.id === activeId);
      const overIndex = colTasks.findIndex((t) => t.id === overId);

      let reordered = colTasks;
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        reordered = arrayMove(colTasks, activeIndex, overIndex);
      }
      const positions = new Map(reordered.map((t, i) => [t.id, i]));
      return prev.map((t) =>
        positions.has(t.id) ? { ...t, position: positions.get(t.id)! } : t
      );
    });
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus[status]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="w-72 rotate-1">
            <KanbanCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
