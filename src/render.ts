import { formatShortDate, isOverdue, toDateKey } from './dates';
import { createIcon, type icons } from './icons';
import { isFilter } from './filter';
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

const createButton = (
  className: string,
  label: string,
  onClick: () => void,
  icon?: keyof typeof icons,
): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  if (icon) button.append(createIcon(icon));
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

  const editRow = document.createElement('div');
  editRow.className = 'edit-row';
  editRow.append(
    dateInput,
    createActions(
      createButton('save-button', 'Save', save),
      createButton('cancel-button', 'Cancel', handlers.onCancel),
    ),
  );

  return [input, editRow];
};

const describeDueDate = (todo: Todo, today: string): string => {
  if (!todo.dueDate) return 'No date';
  return `${isOverdue(todo, today) ? 'Overdue' : 'Due'} ${formatShortDate(todo.dueDate)}`;
};

const createViewContent = (todo: Todo, handlers: TodoItemHandlers, today: string): HTMLElement[] => {
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
  dueDate.textContent = describeDueDate(todo, today);
  if (todo.dueDate) dueDate.prepend(createIcon('calendar'));

  const content = document.createElement('div');
  content.className = 'todo-content';
  content.append(text, dueDate);

  return [
    checkbox,
    content,
    createActions(
      createButton('edit-button', 'Edit', () => handlers.onEdit(todo.id), 'pencil'),
      createButton('remove-button', 'Remove', () => handlers.onRemove(todo.id), 'trash'),
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
  li.dataset.id = String(todo.id);
  li.classList.toggle('completed', todo.completed);
  li.classList.toggle('overdue', isOverdue(todo, today));
  li.classList.toggle('editing', isEditing);
  li.append(...(isEditing ? createEditingContent(todo, handlers) : createViewContent(todo, handlers, today)));
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

/** Shows how many todos each filter matches, e.g. `Active (2)`. */
export const setFilterCounts = (buttons: Iterable<HTMLButtonElement>, counts: Record<Filter, number>): void => {
  for (const button of buttons) {
    const count = button.querySelector('.filter-count');
    if (count && isFilter(button.dataset.filter)) count.textContent = `(${counts[button.dataset.filter]})`;
  }
};

/** Shows `message` in `element`, or hides it when the message is empty. */
export const setErrorMessage = (element: HTMLElement, message: string): void => {
  element.textContent = message;
  element.hidden = !message;
};

/** Adds or removes the red error styling on `input`. */
export const setInputError = (input: HTMLInputElement, hasError: boolean): void => {
  input.classList.toggle('input-error', hasError);
};
