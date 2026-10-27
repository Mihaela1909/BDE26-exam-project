import './style.css'
import { renderDatePicker } from './datePicker';
import { toDateKey } from './dates';
import { elements } from './dom';
import { filterTodos, isFilter } from './filter';
import { renderTodos, setActiveFilter, setErrorMessage, setInputError, type TodoItemHandlers } from './render';
import { TodoStore } from './TodoStore';
import type { Filter } from './types';
import { validateTodoText } from './validation';

const store = new TodoStore();
let editingId: number | null = null;
let currentFilter: Filter = 'all';
let selectedDueDate: string | null = null;

const handlers: TodoItemHandlers = {
  onToggle: (id) => {
    store.toggleCompleted(id);
    render();
  },
  onRemove: (id) => {
    store.remove(id);
    if (editingId === id) editingId = null;
    render();
  },
  onEdit: (id) => {
    editingId = id;
    render();
  },
  onSave: (id, text, dueDate) => {
    store.update(id, { text, dueDate });
    editingId = null;
    render();
  },
  onCancel: () => {
    editingId = null;
    render();
  },
};

const selectDueDate = (day: string | null): void => {
  selectedDueDate = day;
  render();
};

const render = (): void => {
  const todos = store.getAll();
  const today = toDateKey(new Date());

  renderDatePicker(elements.datePicker, today, selectedDueDate, selectDueDate);
  renderTodos(elements.todoList, filterTodos(todos, currentFilter), handlers, editingId, today);
  setActiveFilter(elements.filterButtons, currentFilter);
  elements.clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
};

render();

elements.calendarButton.addEventListener('click', () => {
  const { dateInput } = elements.datePicker;

  // showPicker() opens the browser's calendar; browsers without it fall back to focusing the input
  try {
    dateInput.showPicker();
  } catch {
    dateInput.focus();
  }
});

elements.datePicker.dateInput.addEventListener('change', () => {
  selectDueDate(elements.datePicker.dateInput.value || null);
});

elements.datePicker.clearButton.addEventListener('click', () => selectDueDate(null));

elements.filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!isFilter(button.dataset.filter)) return;

    currentFilter = button.dataset.filter;
    render();
  });
});

elements.clearCompletedButton.addEventListener('click', () => {
  store.clearCompleted();
  render();
});

elements.todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = elements.todoInput.value.trim();
  const error = validateTodoText(text);

  if (error) {
    setErrorMessage(elements.errorMessage, error);
    setInputError(elements.todoInput, true);
    return;
  }

  store.add(text, selectedDueDate ?? undefined);
  selectedDueDate = null;
  render();
  elements.todoInput.value = '';
  setErrorMessage(elements.errorMessage, '');
  setInputError(elements.todoInput, false);
});
