import { useMemo, useState } from 'react';
import type { Task, TaskFilter } from './types/task';
import type { TaskFormValues } from './schemas/taskSchema';
import {
  useCreateTask,
  useDeleteTask,
  useTaskList,
  useToggleTaskStatus,
  useUpdateTask,
} from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { FilterTabs } from './components/FilterTabs';
import { ConfirmDialog } from './components/ConfirmDialog';

export default function App() {
  const { data: tasks, isLoading, isError, error, refetch } = useTaskList();

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleStatus = useToggleTaskStatus();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const counts = useMemo(() => {
    const list = tasks ?? [];
    return {
      all: list.length,
      active: list.filter((t) => t.status === 'active').length,
      completed: list.filter((t) => t.status === 'completed').length,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (!tasks) return tasks;
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  function handleCreateSubmit(values: TaskFormValues) {
    createTask.mutate(
      { title: values.title, notes: values.notes || undefined },
      { onSuccess: () => setIsCreating(false) },
    );
  }

  function handleEditSubmit(values: TaskFormValues) {
    if (!editingTask) return;
    updateTask.mutate(
      { id: editingTask.id, patch: { title: values.title, notes: values.notes || undefined } },
      { onSuccess: () => setEditingTask(null) },
    );
  }

  function handleDeleteConfirm() {
    if (!deletingTask) return;
    deleteTask.mutate(deletingTask.id, { onSuccess: () => setDeletingTask(null) });
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Task Manager</h1>
          <p className="subtitle">A small CRUD demo built with React + TypeScript.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null);
            setIsCreating((open) => !open);
          }}
        >
          {isCreating ? 'Close' : '+ New task'}
        </button>
      </header>

      {isCreating && (
        <section className="panel" aria-label="Create task">
          <TaskForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreating(false)}
            isSubmitting={createTask.isPending}
          />
        </section>
      )}

      {editingTask && (
        <section className="panel" aria-label="Edit task">
          <TaskForm
            initialValues={{ title: editingTask.title, notes: editingTask.notes ?? '' }}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingTask(null)}
            isSubmitting={updateTask.isPending}
          />
        </section>
      )}

      <FilterTabs value={filter} onChange={setFilter} counts={counts} />

      <TaskList
        tasks={visibleTasks}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        onToggle={(task) => toggleStatus.mutate(task)}
        onEdit={(task) => {
          setIsCreating(false);
          setEditingTask(task);
        }}
        onDelete={(task) => setDeletingTask(task)}
      />

      {deletingTask && (
        <ConfirmDialog
          title="Delete this task?"
          description={`"${deletingTask.title}" will be removed. This can't be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTask(null)}
        />
      )}
    </div>
  );
}
