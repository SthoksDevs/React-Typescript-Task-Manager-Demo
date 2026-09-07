/**
 * The Task domain model.
 *
 * This is the shape the UI works with everywhere — it's intentionally
 * decoupled from whatever shape a real backend might return (snake_case
 * columns, wrapper envelopes, etc). If you plug in a real API, map its
 * response into this shape inside `api/taskService.ts` rather than letting
 * backend-specific fields leak into components.
 */
export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/** Fields a caller supplies when creating a task. The server (or mock) owns everything else. */
export interface NewTaskInput {
  title: string;
  notes?: string;
}

/** Fields a caller may change on an existing task. Everything is optional — this is a patch, not a full replace. */
export interface UpdateTaskInput {
  title?: string;
  notes?: string;
  status?: TaskStatus;
}

/** Filter applied client-side to the task list. */
export type TaskFilter = 'all' | TaskStatus;
