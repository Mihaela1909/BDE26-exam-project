import './style.css'
import { applyBackground, isHexColor } from './background';
import { renderDatePicker } from './datePicker';
import { toDateKey } from './dates';
import { elements } from './dom';
import { filterTodos, isFilter } from './filter';
import { renderProgress } from './progress';
import { load, remove, save } from './storage';
import { renderTodos, setActiveFilter, setErrorMessage, setInputError, type TodoItemHandlers } from './render';
import { applyTheme, isTheme, Theme, toggleTheme } from './theme';
import { TodoStore } from './TodoStore';
import type { Filter } from './types';
import { isTodoList, validateTodoText } from './validation';

const STORAGE_KEY = 'todos';
const THEME_KEY = 'theme';
const BACKGROUND_KEY = 'background';

const store = new TodoStore(load(STORAGE_KEY, [], isTodoList));
let editingId: number | null = null;
let currentFilter: Filter = 'all';
let selectedDueDate: string | null = null;
// Without a saved choice, follow the operating system's light/dark setting
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let theme = load(THEME_KEY, prefersDark ? Theme.Dark : Theme.Light, isTheme);
let backgroundColor = load<string | null>(BACKGROUND_KEY, null, isHexColor);

const handlers: TodoItemHandlers = {
  onToggle: (id) => {
    store.toggleCompleted(id);
    saveAndRender();
  },
  onRemove: (id) => {
    store.remove(id);
    if (editingId === id) editingId = null;
    saveAndRender();
  },
  onEdit: (id) => {
    editingId = id;
    render();
  },
  onSave: (id, text, dueDate) => {
    store.update(id, { text, dueDate });
    editingId = null;
    saveAndRender();
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
  renderProgress(elements.progress, store.getProgress());
  elements.clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
  elements.clearAllButton.disabled = todos.length === 0;
};

/** Call after every change to the todos, so they survive a page reload. */
const saveAndRender = (): void => {
  save(STORAGE_KEY, store.getAll());
  render();
};

applyTheme(document.documentElement, elements.themeToggle, theme);
applyBackground(elements.background, backgroundColor, theme);
render();

elements.themeToggle.addEventListener('click', () => {
  theme = toggleTheme(theme);
  save(THEME_KEY, theme);
  applyTheme(document.documentElement, elements.themeToggle, theme);
  // Without a custom color the picker should show the new theme's default
  applyBackground(elements.background, backgroundColor, theme);
});

elements.background.picker.addEventListener('input', () => {
  backgroundColor = elements.background.picker.value;
  save(BACKGROUND_KEY, backgroundColor);
  applyBackground(elements.background, backgroundColor, theme);
});

elements.background.resetButton.addEventListener('click', () => {
  backgroundColor = null;
  remove(BACKGROUND_KEY);
  applyBackground(elements.background, backgroundColor, theme);
});

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
  saveAndRender();
});

elements.clearAllButton.addEventListener('click', () => {
  if (!window.confirm('Delete all todos? This cannot be undone.')) return;

  store.clearAll();
  editingId = null;
  remove(STORAGE_KEY);
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
  saveAndRender();
  elements.todoInput.value = '';
  setErrorMessage(elements.errorMessage, '');
  setInputError(elements.todoInput, false);
});
