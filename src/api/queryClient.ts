import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tasks don't change from outside this tab in this demo, so we don't
      // need to refetch just because the window regained focus.
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

/** One key, defined once, so every hook agrees on how the task list is cached. */
export const taskKeys = {
  all: ['tasks'] as const,
};
