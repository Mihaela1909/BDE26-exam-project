import { describe, expect, it } from 'vitest';
import { TodoStore } from './TodoStore';

describe('TodoStore', () => {
  it('starts empty by default', () => {
    expect(new TodoStore().getAll()).toEqual([]);
  });

  it('adds a new todo that is not completed', () => {
    const store = new TodoStore();
    const todo = store.add('Buy milk');

    expect(todo).toEqual({ id: 1, text: 'Buy milk', completed: false });
    expect(store.getAll()).toEqual([todo]);
  });

  it('gives every todo a unique id', () => {
    const store = new TodoStore();
    const first = store.add('First');
    const second = store.add('Second');

    expect(first.id).not.toBe(second.id);
  });

  it('continues ids after the highest initial id', () => {
    const store = new TodoStore([{ id: 7, text: 'Existing', completed: true }]);

    expect(store.add('New').id).toBe(8);
  });

  it('adds a todo with a due date', () => {
    const store = new TodoStore();

    expect(store.add('Buy milk', '2026-10-30')).toEqual({ id: 1, text: 'Buy milk', completed: false, dueDate: '2026-10-30' });
  });

  it('adds a todo without a due date property when none is given', () => {
    expect(new TodoStore().add('Buy milk')).not.toHaveProperty('dueDate');
  });

  it('updates the text and due date of only the todo with the given id', () => {
    const store = new TodoStore();
    const first = store.add('First');
    const second = store.add('Second');

    store.update(first.id, { text: 'Changed', dueDate: '2026-11-01' });

    expect(store.getAll()).toEqual([{ ...first, text: 'Changed', dueDate: '2026-11-01' }, second]);
  });

  it('removes the due date when updating with no due date', () => {
    const store = new TodoStore();
    const todo = store.add('First', '2026-10-30');

    store.update(todo.id, { text: 'First', dueDate: undefined });

    expect(store.getAll()[0].dueDate).toBeUndefined();
  });

  it('toggles only the todo with the given id between completed and not completed', () => {
    const store = new TodoStore();
    const first = store.add('First');
    const second = store.add('Second');

    store.toggleCompleted(first.id);
    expect(store.getAll()).toEqual([{ ...first, completed: true }, second]);

    store.toggleCompleted(first.id);
    expect(store.getAll()).toEqual([first, second]);
  });

  it('removes only the todo with the given id', () => {
    const store = new TodoStore();
    const first = store.add('First');
    const second = store.add('Second');

    store.remove(first.id);

    expect(store.getAll()).toEqual([second]);
  });

  it('clears only the completed todos', () => {
    const store = new TodoStore([
      { id: 1, text: 'Done', completed: true },
      { id: 2, text: 'Open', completed: false },
      { id: 3, text: 'Also done', completed: true },
    ]);

    store.clearCompleted();

    expect(store.getAll()).toEqual([{ id: 2, text: 'Open', completed: false }]);
  });

  it('ignores removing an id that does not exist', () => {
    const store = new TodoStore();
    store.add('Only');

    store.remove(999);

    expect(store.getAll()).toHaveLength(1);
  });
});
