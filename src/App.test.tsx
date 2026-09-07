import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

function renderApp() {
  // A fresh QueryClient per test avoids cache bleeding between tests —
  // reusing the app's singleton here would let one test's data leak into
  // the next.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads and displays the seeded tasks', async () => {
    renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading tasks/i));

    expect(screen.getByText('Set up the repo')).toBeInTheDocument();
    expect(screen.getByText('Swap the mock service for a real API')).toBeInTheDocument();
  });

  it('creates a new task through the form and shows it in the list', async () => {
    const user = userEvent.setup();
    renderApp();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading tasks/i));

    await user.click(screen.getByRole('button', { name: /new task/i }));
    await user.type(screen.getByLabelText(/title/i), 'Publish the repo');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(await screen.findByText('Publish the repo')).toBeInTheDocument();
  });
});
