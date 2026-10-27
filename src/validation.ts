import type { Todo } from './types';

/**
 * Checks the text typed into the todo input.
 * @returns an error message, or `null` if the text is valid
 */
export const validateTodoText = (text: string): string | null => {
  if (!text.trim()) {
    return 'Please enter a todo item.';
  }

  return null;
};

const isTodo = (value: unknown): value is Todo => {
  if (typeof value !== 'object' || value === null) return false;

  const todo = value as Record<string, unknown>;
  return (
    typeof todo.id === 'number' &&
    typeof todo.text === 'string' &&
    typeof todo.completed === 'boolean' &&
    (todo.dueDate === undefined || typeof todo.dueDate === 'string')
  );
};

/** Checks that data loaded from storage is a list of todos. */
export const isTodoList = (value: unknown): value is Todo[] => Array.isArray(value) && value.every(isTodo);
