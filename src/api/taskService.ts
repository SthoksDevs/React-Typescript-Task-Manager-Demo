import type { NewTaskInput, Task, UpdateTaskInput } from '../types/task';

/**
 * ── Service layer ───────────────────────────────────────────────────────
 *
 * Every component and hook in this app talks to tasks through the four
 * functions exported below, never through `fetch`/`localStorage` directly.
 * That's the whole point of this file: it's the *only* place that knows
 * where task data actually lives.
 *
 * Right now it's backed by localStorage with a simulated network delay, so
 * the app is fully runnable with `npm run dev` and no backend. To point
 * this at a real API, replace the body of each function with a fetch call
 * and leave the signatures alone — nothing outside this file has to change.
 *
 * Example of what `getTasks` looks like against a real REST API:
 *
 *   export async function getTasks(): Promise<Task[]> {
 *     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks`);
 *     if (!res.ok) throw new Error(`Failed to load tasks (${res.status})`);
 *     return res.json();
 *   }
 *
 * TODO (left out on purpose — see README "What's left out"):
 *   - auth headers / cookies once there's a real backend with users
 *   - pagination (this loads the whole list, fine for a demo dataset)
 *   - retry/backoff policy for flaky networks
 */

const STORAGE_KEY = 'react-ts-crud-demo:tasks';
const SIMULATED_LATENCY_MS = 350;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readStore(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedTasks();

  try {
    return JSON.parse(raw) as Task[];
  } catch {
    // Corrupt localStorage shouldn't crash the app — fall back to a fresh seed.
    return seedTasks();
  }
}

function writeStore(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function seedTasks(): Task[] {
  const now = new Date().toISOString();
  const seeded: Task[] = [
    {
      id: crypto.randomUUID(),
      title: 'Set up the repo',
      notes: 'Vite + React + TypeScript, ESLint, Prettier, Vitest.',
      status: 'completed',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: 'Wire up TanStack Query',
      notes: 'Caching, mutations, and an optimistic update on toggle.',
      status: 'completed',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: 'Swap the mock service for a real API',
      notes: 'See the comment at the top of api/taskService.ts.',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ];
  writeStore(seeded);
  return seeded;
}

export async function getTasks(): Promise<Task[]> {
  await sleep(SIMULATED_LATENCY_MS);
  return readStore();
}

export async function createTask(input: NewTaskInput): Promise<Task> {
  await sleep(SIMULATED_LATENCY_MS);

  const now = new Date().toISOString();
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title,
    notes: input.notes,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  const tasks = readStore();
  writeStore([task, ...tasks]);
  return task;
}

export async function updateTask(id: string, patch: UpdateTaskInput): Promise<Task> {
  await sleep(SIMULATED_LATENCY_MS);

  const tasks = readStore();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new Error(`Task ${id} was not found. It may have been deleted elsewhere.`);
  }

  const updated: Task = {
    ...tasks[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  tasks[index] = updated;
  writeStore(tasks);
  return updated;
}

export async function deleteTask(id: string): Promise<void> {
  await sleep(SIMULATED_LATENCY_MS);

  const tasks = readStore();
  const next = tasks.filter((task) => task.id !== id);
  if (next.length === tasks.length) {
    throw new Error(`Task ${id} was not found. It may have already been deleted.`);
  }
  writeStore(next);
}
