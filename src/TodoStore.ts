import type { Todo } from './types';

/** Holds the todo list and all operations that change it. */
export class TodoStore {
  private todos: Todo[];
  private nextId: number;

  /**
   * @param initialTodos todos to start with, e.g. loaded from storage
   */
  constructor(initialTodos: Todo[] = []) {
    this.todos = [...initialTodos];
    this.nextId = Math.max(0, ...initialTodos.map((todo) => todo.id)) + 1;
  }

  /** Returns all todos in the order they were added. */
  getAll(): readonly Todo[] {
    return this.todos;
  }

  /**
   * Adds a new, not yet completed todo.
   * @returns the created todo
   */
  add(text: string): Todo {
    const newTodo: Todo = {
      id: this.nextId++,
      text,
      completed: false,
    };

    this.todos = [...this.todos, newTodo];
    return newTodo;
  }

  /** Removes the todo with the given id. Does nothing if it doesn't exist. */
  remove(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }
}
