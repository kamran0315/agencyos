import { Badge } from "@/components/ui/badge";
import {
  PROJECT_STATUS_LABELS,
  PRIORITY_LABELS,
  type ProjectStatus,
  type Priority,
} from "@/lib/types";

const projectStatusVariants: Record<
  ProjectStatus,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"
> = {
  discussion: "secondary",
  in_progress: "info",
  waiting_client: "warning",
  revision: "warning",
  completed: "success",
  cancelled: "outline",
};

const priorityVariants: Record<
  Priority,
  "default" | "secondary" | "destructive" | "outline" | "warning"
> = {
  low: "outline",
  medium: "secondary",
  high: "warning",
  urgent: "destructive",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant={projectStatusVariants[status]}>
      {PROJECT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant={priorityVariants[priority]} className="capitalize">
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
