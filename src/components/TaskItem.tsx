import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'completed';

  return (
    <li className={`task-item ${isCompleted ? 'is-completed' : ''}`}>
      <label className="task-checkbox">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggle(task)}
          aria-label={`Mark "${task.title}" as ${isCompleted ? 'active' : 'completed'}`}
        />
        <span aria-hidden="true" className="checkbox-visual" />
      </label>

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.notes && <p className="task-notes">{task.notes}</p>}
      </div>

      <div className="task-actions">
        <button type="button" className="btn btn-ghost btn-small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-small btn-danger-text"
          onClick={() => onDelete(task)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
