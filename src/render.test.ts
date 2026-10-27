import { describe, expect, it, vi } from 'vitest';
import { createTodoItem, renderTodos, setErrorMessage, setInputError } from './render';

describe('createTodoItem', () => {
  it('shows HTML in the todo text as plain text', () => {
    const li = createTodoItem({ id: 1, text: '<img src=x onerror=alert(1)>', completed: false }, () => {});

    expect(li.querySelector('img')).toBeNull();
    expect(li.querySelector('span')?.textContent).toBe('<img src=x onerror=alert(1)>');
  });

  it('calls onRemove with the todo id when remove is clicked', () => {
    const onRemove = vi.fn();
    const li = createTodoItem({ id: 42, text: 'Buy milk', completed: false }, onRemove);

    li.querySelector<HTMLButtonElement>('.remove-button')?.click();

    expect(onRemove).toHaveBeenCalledWith(42);
  });
});

describe('renderTodos', () => {
  it('replaces the list with one item per todo', () => {
    const list = document.createElement('ul');
    list.innerHTML = '<li>old</li>';

    renderTodos(
      list,
      [
        { id: 1, text: 'First', completed: false },
        { id: 2, text: 'Second', completed: false },
      ],
      () => {},
    );

    expect([...list.querySelectorAll('span')].map((span) => span.textContent)).toEqual(['First', 'Second']);
  });
});

describe('setErrorMessage', () => {
  it('shows a non-empty message', () => {
    const element = document.createElement('p');
    setErrorMessage(element, 'Oops');

    expect(element.textContent).toBe('Oops');
    expect(element.style.display).toBe('block');
  });

  it('hides the element when the message is empty', () => {
    const element = document.createElement('p');
    setErrorMessage(element, '');

    expect(element.style.display).toBe('none');
  });
});

describe('setInputError', () => {
  it('adds the input-error class when there is an error', () => {
    const input = document.createElement('input');
    setInputError(input, true);

    expect(input.classList.contains('input-error')).toBe(true);
  });

  it('removes the input-error class when the error is gone', () => {
    const input = document.createElement('input');
    input.classList.add('input-error');
    setInputError(input, false);

    expect(input.classList.contains('input-error')).toBe(false);
  });
});
