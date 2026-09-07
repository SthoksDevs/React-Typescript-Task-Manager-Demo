import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as taskService from '../api/taskService';
import { taskKeys } from '../api/queryClient';
import type { NewTaskInput, Task, UpdateTaskInput } from '../types/task';

/** Read the task list. Loading/error state comes straight from React Query. */
export function useTaskList() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: taskService.getTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewTaskInput) => taskService.createTask(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateTaskInput }) =>
      taskService.updateTask(id, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

/**
 * Toggling "done" is the one interaction that happens often enough (and
 * should feel instant enough) that it's worth an optimistic update instead
 * of waiting on the round trip. This is the pattern to reach for elsewhere
 * once you're confident the mutation rarely fails.
 *
 * The dance is: cancel any in-flight refetch for this key, snapshot the
 * current cache so we can restore it, write the optimistic value, then
 * either leave it (on success) or roll it back (on error). `onSettled`
 * always reconciles with the server afterwards so we never drift.
 */
export function useToggleTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Task) =>
      taskService.updateTask(task.id, {
        status: task.status === 'completed' ? 'active' : 'completed',
      }),

    onMutate: async (task: Task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.all);

      queryClient.setQueryData<Task[]>(taskKeys.all, (current) =>
        current?.map((t) =>
          t.id === task.id
            ? { ...t, status: t.status === 'completed' ? 'active' : 'completed' }
            : t,
        ),
      );

      return { previousTasks };
    },

    onError: (_err, _task, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.all, context.previousTasks);
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
