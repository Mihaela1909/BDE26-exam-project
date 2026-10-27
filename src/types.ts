/** A single item in the todo list. */
export interface Todo {
  readonly id: number;
  text: string;
  completed: boolean;
}

/** Which todos the list shows. */
export type Filter = 'all' | 'active' | 'completed';
