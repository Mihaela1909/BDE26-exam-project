import { formatDate, isOverdue, toDateKey } from './dates';
import type { Filter, Todo } from './types';
import { validateTodoText } from './validation';

/** What the todo list items can ask the app to do. */
export interface TodoItemHandlers {
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number) => void;
  onSave: (id: number, text: string, dueDate?: string) => void;
  onCancel: () => void;
}

const createButton = (className: string, label: string, onClick: () => void): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
};

const createActions = (...buttons: HTMLButtonElement[]): HTMLDivElement => {
  const actions = document.createElement('div');
  actions.className = 'todo-actions';
  actions.append(...buttons);
  return actions;
};

const createEditingContent = (todo: Todo, handlers: TodoItemHandlers): HTMLElement[] => {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = todo.text;

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.className = 'edit-date';
  dateInput.value = todo.dueDate ?? '';

  const save = (): void => {
    if (validateTodoText(input.value)) {
      setInputError(input, true);
      return;
    }

    handlers.onSave(todo.id, input.value.trim(), dateInput.value || undefined);
  };

  for (const field of [input, dateInput]) {
    field.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') save();
      if (event.key === 'Escape') handlers.onCancel();
    });
  }

  return [
    input,
    dateInput,
    createActions(
      createButton('save-button', 'save', save),
      createButton('cancel-button', 'cancel', handlers.onCancel),
    ),
  ];
};

const createViewContent = (todo: Todo, handlers: TodoItemHandlers): HTMLElement[] => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'toggle-checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => handlers.onToggle(todo.id));

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = todo.text;

  const dueDate = document.createElement('span');
  dueDate.className = 'due-date';
  dueDate.classList.toggle('no-date', !todo.dueDate);
  dueDate.textContent = todo.dueDate ? formatDate(todo.dueDate) : 'No date';

  const content = document.createElement('div');
  content.className = 'todo-content';
  content.append(text, dueDate);

  return [
    checkbox,
    content,
    createActions(
      createButton('edit-button', 'edit', () => handlers.onEdit(todo.id)),
      createButton('remove-button', 'remove', () => handlers.onRemove(todo.id)),
    ),
  ];
};

/**
 * Builds the list item for one todo, either showing its text or, while editing, an input field.
 * Uses `textContent` so the todo text is never parsed as HTML.
 * @param today today's date as `YYYY-MM-DD`, used to mark overdue todos
 */
export const createTodoItem = (
  todo: Todo,
  handlers: TodoItemHandlers,
  isEditing = false,
  today = toDateKey(new Date()),
): HTMLLIElement => {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.classList.toggle('completed', todo.completed);
  li.classList.toggle('overdue', isOverdue(todo, today));
  li.append(...(isEditing ? createEditingContent(todo, handlers) : createViewContent(todo, handlers)));
  return li;
};

/**
 * Replaces the contents of `list` with one item per todo.
 * @param editingId the todo currently being edited, if any; its input gets focus
 * @param today today's date as `YYYY-MM-DD`, used to mark overdue todos
 */
export const renderTodos = (
  list: HTMLUListElement,
  todos: readonly Todo[],
  handlers: TodoItemHandlers,
  editingId: number | null = null,
  today = toDateKey(new Date()),
): void => {
  list.replaceChildren(...todos.map((todo) => createTodoItem(todo, handlers, todo.id === editingId, today)));
  list.querySelector<HTMLInputElement>('.edit-input')?.focus();
};

/** Highlights the filter button whose `data-filter` matches `filter`. */
export const setActiveFilter = (buttons: Iterable<HTMLButtonElement>, filter: Filter): void => {
  for (const button of buttons) {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  }
};

/** Shows `message` in `element`, or hides it when the message is empty. */
export const setErrorMessage = (element: HTMLElement, message: string): void => {
  element.textContent = message;
  element.style.display = message ? 'block' : 'none';
};

/** Adds or removes the red error styling on `input`. */
export const setInputError = (input: HTMLInputElement, hasError: boolean): void => {
  input.classList.toggle('input-error', hasError);
};
