import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({
  tasks,
  isLoading,
  isError,
  error,
  onRetry,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (isLoading) {
    return (
      <p className="state-message" role="status">
        Loading tasks…
      </p>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : 'Something went wrong.';
    return (
      <div className="state-message state-error" role="alert">
        <p>Couldn&apos;t load your tasks. {message}</p>
        <button type="button" className="btn btn-ghost btn-small" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <p className="state-message">Nothing here yet. Add your first task above to get started.</p>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
