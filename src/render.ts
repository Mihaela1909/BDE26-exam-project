import type { Todo } from './types';

/**
 * Builds the list item for one todo.
 * Uses `textContent` so the todo text is never parsed as HTML.
 */
export const createTodoItem = (todo: Todo, onRemove: (id: number) => void): HTMLLIElement => {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const text = document.createElement('span');
  text.textContent = todo.text;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'remove';
  removeButton.addEventListener('click', () => onRemove(todo.id));

  li.append(text, removeButton);
  return li;
};

/** Replaces the contents of `list` with one item per todo. */
export const renderTodos = (
  list: HTMLUListElement,
  todos: readonly Todo[],
  onRemove: (id: number) => void,
): void => {
  list.replaceChildren(...todos.map((todo) => createTodoItem(todo, onRemove)));
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
