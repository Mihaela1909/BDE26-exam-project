/** The page elements the app reads from and writes to. */
export const elements = {
  todoInput: document.getElementById('todo-input') as HTMLInputElement,
  todoForm: document.querySelector('.todo-form') as HTMLFormElement,
  todoList: document.getElementById('todo-list') as HTMLUListElement,
  errorMessage: document.getElementById('error-message') as HTMLParagraphElement,
};
