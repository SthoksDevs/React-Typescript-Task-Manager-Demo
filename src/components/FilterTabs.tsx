import type { TaskFilter } from '../types/task';

interface FilterTabsProps {
  value: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  counts: Record<TaskFilter, number>;
}

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          role="tab"
          aria-selected={value === filter.key}
          className={`filter-tab ${value === filter.key ? 'is-active' : ''}`}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
          <span className="filter-count">{counts[filter.key]}</span>
        </button>
      ))}
    </div>
  );
}
