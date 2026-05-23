export type ProjectStatus =
  | "discussion"
  | "in_progress"
  | "waiting_client"
  | "revision"
  | "completed"
  | "cancelled";

export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export type NoteCategory =
  | "requirement"
  | "revision"
  | "hosting"
  | "credential"
  | "meeting"
  | "internal";

export type ProposalCategory =
  | "upwork"
  | "fiverr"
  | "discovery"
  | "onboarding"
  | "followup";

export type NotificationType =
  | "deadline"
  | "task_assigned"
  | "status_change"
  | "project_update"
  | "client_message";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "member";
}

export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  fiverr_url: string | null;
  upwork_url: string | null;
  website: string | null;
  notes: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  budget: number | null;
  deadline: string | null;
  progress: number;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  assignee_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  position: number;
  created_at: string;
}

export interface Note {
  id: string;
  project_id: string | null;
  client_id: string | null;
  title: string;
  body: string | null;
  category: NoteCategory;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  title: string;
  body: string;
  category: ProposalCategory;
  tags: string[];
  use_count: number;
  created_at: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface FileItem {
  id: string;
  project_id: string | null;
  client_id: string | null;
  name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  discussion: "Discussion",
  in_progress: "In Progress",
  waiting_client: "Waiting for Client",
  revision: "Revision",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const NOTE_CATEGORY_LABELS: Record<NoteCategory, string> = {
  requirement: "Requirements",
  revision: "Revisions",
  hosting: "Hosting",
  credential: "Credentials",
  meeting: "Meeting Notes",
  internal: "Internal",
};

export const PROPOSAL_CATEGORY_LABELS: Record<ProposalCategory, string> = {
  upwork: "Upwork",
  fiverr: "Fiverr",
  discovery: "Discovery",
  onboarding: "Onboarding",
  followup: "Follow-up",
};
