/** A single item in the todo list. */
export interface Todo {
  readonly id: number;
  text: string;
  completed: boolean;
  /** Due date as `YYYY-MM-DD`; todos without one have no deadline. */
  dueDate?: string;
}

/** Which todos the list shows. */
export type Filter = 'all' | 'active' | 'completed';

/** How many todos are completed, and how many there are in total. */
export type Progress = [done: number, total: number];
