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

  it('updates the text of only the todo with the given id', () => {
    const store = new TodoStore();
    const first = store.add('First');
    const second = store.add('Second');

    store.updateText(first.id, 'Changed');

    expect(store.getAll()).toEqual([{ ...first, text: 'Changed' }, second]);
  });

  it('removes only the todo with the given id', () => {
    const store = new TodoStore();
    const first = store.add('First');
    const second = store.add('Second');

    store.remove(first.id);

    expect(store.getAll()).toEqual([second]);
  });

  it('ignores removing an id that does not exist', () => {
    const store = new TodoStore();
    store.add('Only');

    store.remove(999);

    expect(store.getAll()).toHaveLength(1);
  });
});
