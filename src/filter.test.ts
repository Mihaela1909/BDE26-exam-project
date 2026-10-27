import { describe, expect, it } from 'vitest';
import { filterTodos, isFilter } from './filter';
import type { Todo } from './types';

const todos: Todo[] = [
  { id: 1, text: 'Open', completed: false },
  { id: 2, text: 'Done', completed: true },
  { id: 3, text: 'Also open', completed: false },
];

describe('filterTodos', () => {
  it('returns all todos for "all"', () => {
    expect(filterTodos(todos, 'all')).toEqual(todos);
  });

  it('returns only todos that are not completed for "active"', () => {
    expect(filterTodos(todos, 'active').map((todo) => todo.id)).toEqual([1, 3]);
  });

  it('returns only completed todos for "completed"', () => {
    expect(filterTodos(todos, 'completed').map((todo) => todo.id)).toEqual([2]);
  });
});

describe('isFilter', () => {
  it('accepts the three filter names', () => {
    expect(['all', 'active', 'completed'].every(isFilter)).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isFilter('done')).toBe(false);
    expect(isFilter(undefined)).toBe(false);
  });
});
