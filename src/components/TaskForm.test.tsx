import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('shows a validation error and does not submit when the title is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />);

    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with the entered values when valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} isSubmitting={false} />);

    await user.type(screen.getByLabelText(/title/i), 'Buy groceries');
    await user.type(screen.getByLabelText(/notes/i), 'Milk, eggs, bread');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    // react-hook-form's handleSubmit invokes this with (values, event) — only
    // the first argument is ours to assert on.
    expect(onSubmit.mock.calls[0][0]).toEqual({
      title: 'Buy groceries',
      notes: 'Milk, eggs, bread',
    });
  });

  it('pre-fills fields and shows "Save changes" when editing an existing task', () => {
    render(
      <TaskForm
        initialValues={{ title: 'Existing task', notes: 'Existing notes' }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        isSubmitting={false}
      />,
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue('Existing task');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
