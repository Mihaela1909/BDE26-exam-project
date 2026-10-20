import { describe, expect, it } from 'vitest';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const addTodo = (todos: Todo[], text: string): Todo[] => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
  };

  return [...todos, newTodo];
};

const removeTodo = (todos: Todo[], id: number): Todo[] => {
  return todos.filter((todo) => todo.id !== id);
};

describe('todo helpers', () => {
  it('should add a new todo to the list', () => {
    const todos: Todo[] = [];
    const result = addTodo(todos, 'Test todo');

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Test todo');
    expect(result[0].completed).toBe(false);
  });

  it('should remove a todo from the list', () => {
    const todos: Todo[] = [
      { id: 1, text: 'First todo', completed: false },
      { id: 2, text: 'Second todo', completed: true },
    ];

    expect(removeTodo(todos, 1)).toEqual([
      { id: 2, text: 'Second todo', completed: true },
    ]);
  });
});