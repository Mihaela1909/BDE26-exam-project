import type { Todo } from './types';

/** Turns a date into a `YYYY-MM-DD` string in local time, the same format `<input type="date">` uses. */
export const toDateKey = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

/** Turns a `YYYY-MM-DD` string back into a local date. */
export const fromDateKey = (key: string): Date => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** Returns the date keys of `count` days in a row, starting with `start`. */
export const getDaysFrom = (start: string, count: number): string[] => {
  const first = fromDateKey(start);

  return Array.from({ length: count }, (_, index) =>
    toDateKey(new Date(first.getFullYear(), first.getMonth(), first.getDate() + index)),
  );
};

/** Formats a date key for display, e.g. `Fri 31 Oct`. */
export const formatDate = (key: string): string =>
  fromDateKey(key).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

/** A todo is overdue when its due date is before `today` and it isn't completed yet. */
export const isOverdue = (todo: Todo, today: string): boolean =>
  !todo.completed && todo.dueDate !== undefined && todo.dueDate < today;
