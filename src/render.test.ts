import { describe, expect, it, vi } from 'vitest';
import {
  createTodoItem,
  renderTodos,
  setActiveFilter,
  setErrorMessage,
  setFilterCounts,
  setInputError,
  type TodoItemHandlers,
} from './render';

const todo = { id: 42, text: 'Buy milk', completed: false };

const createHandlers = (): TodoItemHandlers => ({
  onToggle: vi.fn(),
  onRemove: vi.fn(),
  onEdit: vi.fn(),
  onSave: vi.fn(),
  onCancel: vi.fn(),
});

const click = (li: HTMLLIElement, selector: string): void => {
  li.querySelector<HTMLButtonElement>(selector)?.click();
};

describe('createTodoItem', () => {
  it('shows HTML in the todo text as plain text', () => {
    const li = createTodoItem({ id: 1, text: '<img src=x onerror=alert(1)>', completed: false }, createHandlers());

    expect(li.querySelector('img')).toBeNull();
    expect(li.querySelector('.todo-text')?.textContent).toBe('<img src=x onerror=alert(1)>');
  });

  it('calls onRemove with the todo id when remove is clicked', () => {
    const handlers = createHandlers();
    click(createTodoItem(todo, handlers), '.remove-button');

    expect(handlers.onRemove).toHaveBeenCalledWith(42);
  });

  it('shows a completed todo as checked and crossed out', () => {
    const li = createTodoItem({ ...todo, completed: true }, createHandlers());

    expect(li.querySelector<HTMLInputElement>('.toggle-checkbox')?.checked).toBe(true);
    expect(li.classList.contains('completed')).toBe(true);
  });

  it('shows an open todo as unchecked and not crossed out', () => {
    const li = createTodoItem(todo, createHandlers());

    expect(li.querySelector<HTMLInputElement>('.toggle-checkbox')?.checked).toBe(false);
    expect(li.classList.contains('completed')).toBe(false);
  });

  it('calls onToggle with the todo id when the checkbox is clicked', () => {
    const handlers = createHandlers();
    const checkbox = createTodoItem(todo, handlers).querySelector<HTMLInputElement>('.toggle-checkbox')!;

    checkbox.dispatchEvent(new Event('change'));

    expect(handlers.onToggle).toHaveBeenCalledWith(42);
  });

  it('calls onEdit with the todo id when edit is clicked', () => {
    const handlers = createHandlers();
    click(createTodoItem(todo, handlers), '.edit-button');

    expect(handlers.onEdit).toHaveBeenCalledWith(42);
  });

  it('shows an input with the current text while editing', () => {
    const li = createTodoItem(todo, createHandlers(), true);

    expect(li.querySelector('.todo-text')).toBeNull();
    expect(li.querySelector<HTMLInputElement>('.edit-input')?.value).toBe('Buy milk');
  });

  it('calls onSave with the trimmed new text when save is clicked', () => {
    const handlers = createHandlers();
    const li = createTodoItem(todo, handlers, true);
    li.querySelector<HTMLInputElement>('.edit-input')!.value = '  Buy oat milk  ';

    click(li, '.save-button');

    expect(handlers.onSave).toHaveBeenCalledWith(42, 'Buy oat milk', undefined);
  });

  it('does not save empty text and marks the input as invalid', () => {
    const handlers = createHandlers();
    const li = createTodoItem(todo, handlers, true);
    const input = li.querySelector<HTMLInputElement>('.edit-input')!;
    input.value = '   ';

    click(li, '.save-button');

    expect(handlers.onSave).not.toHaveBeenCalled();
    expect(input.classList.contains('input-error')).toBe(true);
  });

  it('saves on Enter and cancels on Escape', () => {
    const handlers = createHandlers();
    const input = createTodoItem(todo, handlers, true).querySelector<HTMLInputElement>('.edit-input')!;

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(handlers.onSave).toHaveBeenCalledWith(42, 'Buy milk', undefined);
    expect(handlers.onCancel).toHaveBeenCalled();
  });

  it('shows "Due <date>", or "No date" when there is none', () => {
    const withDate = createTodoItem({ ...todo, dueDate: '2026-10-30' }, createHandlers());
    const withoutDate = createTodoItem(todo, createHandlers());

    expect(withDate.querySelector('.due-date')?.textContent).toBe('Due 30 Oct');
    expect(withoutDate.querySelector('.due-date')?.textContent).toBe('No date');
    expect(withoutDate.querySelector('.due-date')?.classList.contains('no-date')).toBe(true);
  });

  it('marks a todo with a past due date as overdue', () => {
    const li = createTodoItem({ ...todo, dueDate: '2026-10-26' }, createHandlers(), false, '2026-10-27');

    expect(li.classList.contains('overdue')).toBe(true);
    expect(li.querySelector('.due-date')?.textContent).toBe('Overdue 26 Oct');
  });

  it('does not mark a completed todo as overdue', () => {
    const li = createTodoItem({ ...todo, completed: true, dueDate: '2026-10-26' }, createHandlers(), false, '2026-10-27');

    expect(li.classList.contains('overdue')).toBe(false);
  });

  it('saves the changed due date from the edit date field', () => {
    const handlers = createHandlers();
    const li = createTodoItem({ ...todo, dueDate: '2026-10-30' }, handlers, true);
    const dateInput = li.querySelector<HTMLInputElement>('.edit-date')!;

    expect(dateInput.value).toBe('2026-10-30');

    dateInput.value = '2026-11-02';
    click(li, '.save-button');

    expect(handlers.onSave).toHaveBeenCalledWith(42, 'Buy milk', '2026-11-02');
  });

  it('calls onCancel when cancel is clicked', () => {
    const handlers = createHandlers();
    click(createTodoItem(todo, handlers, true), '.cancel-button');

    expect(handlers.onCancel).toHaveBeenCalled();
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
      createHandlers(),
    );

    expect([...list.querySelectorAll('.todo-text')].map((span) => span.textContent)).toEqual(['First', 'Second']);
  });

  it('shows only the todo being edited as an input', () => {
    const list = document.createElement('ul');

    renderTodos(
      list,
      [
        { id: 1, text: 'First', completed: false },
        { id: 2, text: 'Second', completed: false },
      ],
      createHandlers(),
      2,
    );

    expect(list.querySelectorAll('.edit-input')).toHaveLength(1);
    expect(list.querySelector<HTMLInputElement>('.edit-input')?.value).toBe('Second');
  });
});

describe('setActiveFilter', () => {
  it('highlights only the button for the chosen filter', () => {
    const buttons = (['all', 'active', 'completed'] as const).map((filter) => {
      const button = document.createElement('button');
      button.dataset.filter = filter;
      return button;
    });

    setActiveFilter(buttons, 'active');

    expect(buttons.map((button) => button.classList.contains('active'))).toEqual([false, true, false]);
    expect(buttons.map((button) => button.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false']);
  });
});

describe('setFilterCounts', () => {
  it('shows how many todos each filter matches', () => {
    const buttons = (['all', 'active', 'completed'] as const).map((filter) => {
      const button = document.createElement('button');
      button.dataset.filter = filter;
      button.innerHTML = '<span class="filter-count"></span>';
      return button;
    });

    setFilterCounts(buttons, { all: 4, active: 2, completed: 2 });

    expect(buttons.map((button) => button.textContent)).toEqual(['(4)', '(2)', '(2)']);
  });
});

describe('setErrorMessage', () => {
  it('shows a non-empty message', () => {
    const element = document.createElement('p');
    setErrorMessage(element, 'Oops');

    expect(element.textContent).toBe('Oops');
    expect(element.hidden).toBe(false);
  });

  it('hides the element when the message is empty', () => {
    const element = document.createElement('p');
    setErrorMessage(element, '');

    expect(element.hidden).toBe(true);
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
