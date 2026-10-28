import { describe, expect, it } from 'vitest';
import { isTodoList, validateTodoText } from './validation';

describe('validateTodoText', () => {
  it('rejects empty text', () => {
    expect(validateTodoText('')).toBe('Oops — write something first.');
  });

  it('rejects text with only spaces', () => {
    expect(validateTodoText('   ')).toBe('Oops — write something first.');
  });

  it('accepts normal text', () => {
    expect(validateTodoText('Buy milk')).toBeNull();
  });
});

describe('isTodoList', () => {
  it('accepts a list of todos, with or without due date', () => {
    expect(
      isTodoList([
        { id: 1, text: 'Buy milk', completed: false },
        { id: 2, text: 'Pay rent', completed: true, dueDate: '2026-10-30' },
      ]),
    ).toBe(true);
  });

  it('accepts an empty list', () => {
    expect(isTodoList([])).toBe(true);
  });

  it('rejects data that is not a list of todos', () => {
    expect(isTodoList({ id: 1 })).toBe(false);
    expect(isTodoList([{ id: '1', text: 'Buy milk', completed: false }])).toBe(false);
    expect(isTodoList([{ id: 1, text: 'Buy milk' }])).toBe(false);
    expect(isTodoList([null])).toBe(false);
  });
});
