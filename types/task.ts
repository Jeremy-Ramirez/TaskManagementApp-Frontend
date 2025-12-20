export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
