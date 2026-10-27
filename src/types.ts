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
