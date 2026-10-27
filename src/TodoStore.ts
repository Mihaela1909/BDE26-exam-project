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
   * @param dueDate optional due date as `YYYY-MM-DD`
   * @returns the created todo
   */
  add(text: string, dueDate?: string): Todo {
    const newTodo: Todo = {
      id: this.nextId++,
      text,
      completed: false,
      ...(dueDate && { dueDate }),
    };

    this.todos = [...this.todos, newTodo];
    return newTodo;
  }

  /**
   * Changes the text and due date of the todo with the given id. Does nothing if it doesn't exist.
   * Passing `dueDate: undefined` removes the due date.
   */
  update(id: number, changes: Pick<Todo, 'text' | 'dueDate'>): void {
    this.todos = this.todos.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo));
  }

  /** Flips the todo with the given id between completed and not completed. */
  toggleCompleted(id: number): void {
    this.todos = this.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  /** Removes the todo with the given id. Does nothing if it doesn't exist. */
  remove(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  /** Removes all completed todos and keeps the active ones. */
  clearCompleted(): void {
    this.todos = this.todos.filter((todo) => !todo.completed);
  }
}
