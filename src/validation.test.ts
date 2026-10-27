import { describe, expect, it } from 'vitest';
import { validateTodoText } from './validation';

describe('validateTodoText', () => {
  it('rejects empty text', () => {
    expect(validateTodoText('')).toBe('Please enter a todo item.');
  });

  it('rejects text with only spaces', () => {
    expect(validateTodoText('   ')).toBe('Please enter a todo item.');
  });

  it('accepts normal text', () => {
    expect(validateTodoText('Buy milk')).toBeNull();
  });
});
