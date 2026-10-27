import { beforeEach, describe, expect, it } from 'vitest';
import { load, remove, save } from './storage';

const isNumberList = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number');

beforeEach(() => {
  localStorage.clear();
});

describe('save / load', () => {
  it('stores a value and reads it back', () => {
    save('numbers', [1, 2, 3]);

    expect(load('numbers', [])).toEqual([1, 2, 3]);
  });

  it('returns the fallback when nothing is stored', () => {
    expect(load('missing', ['fallback'])).toEqual(['fallback']);
  });

  it('returns the fallback when the stored text is not valid JSON', () => {
    localStorage.setItem('broken', '{not json');

    expect(load('broken', [])).toEqual([]);
  });

  it('returns the fallback when the stored value fails the check', () => {
    save('numbers', ['a', 'b']);

    expect(load('numbers', [], isNumberList)).toEqual([]);
  });
});

describe('remove', () => {
  it('deletes the stored value', () => {
    save('numbers', [1]);
    remove('numbers');

    expect(localStorage.getItem('numbers')).toBeNull();
  });
});
