import type { Filter, Todo } from './types';

const filters: readonly Filter[] = ['all', 'active', 'completed'];

/** Checks whether `value` (e.g. read from a `data-filter` attribute) is a valid filter. */
export const isFilter = (value: unknown): value is Filter => filters.includes(value as Filter);

/** Returns only the todos that match `filter`, keeping their order. */
export const filterTodos = (todos: readonly Todo[], filter: Filter): readonly Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    case 'all':
      return todos;
  }
};
