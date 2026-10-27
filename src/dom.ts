/** The page elements the app reads from and writes to. */
export const elements = {
  todoInput: document.getElementById('todo-input') as HTMLInputElement,
  todoForm: document.querySelector('.todo-form') as HTMLFormElement,
  todoList: document.getElementById('todo-list') as HTMLUListElement,
  errorMessage: document.getElementById('error-message') as HTMLParagraphElement,
  clearCompletedButton: document.getElementById('clear-completed') as HTMLButtonElement,
  filterButtons: document.querySelectorAll<HTMLButtonElement>('.filter-button'),
  progress: {
    bar: document.getElementById('progress-bar') as HTMLDivElement,
    fill: document.getElementById('progress-fill') as HTMLDivElement,
    text: document.getElementById('progress-text') as HTMLParagraphElement,
  },
  calendarButton: document.getElementById('calendar-button') as HTMLButtonElement,
  datePicker: {
    label: document.getElementById('date-label') as HTMLSpanElement,
    clearButton: document.getElementById('clear-date') as HTMLButtonElement,
    weekStrip: document.getElementById('week-strip') as HTMLDivElement,
    dateInput: document.getElementById('due-date-input') as HTMLInputElement,
  },
};
