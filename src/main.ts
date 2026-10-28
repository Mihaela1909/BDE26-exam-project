import './style.css'
import { animateOut, prefersReducedMotion, restartAnimation } from './animations';
import { applyBackground, getSwatchColor, isHexColor } from './background';
import { renderDatePicker } from './datePicker';
import { toDateKey } from './dates';
import {
  createFlower,
  createMainFlowerSpecs,
  createRandomBigFlowerSpec,
  createRandomFlowerSpec,
  keepReblooming,
} from './decor';
import { elements } from './dom';
import { getEmptyMessage, renderEmptyState } from './emptyState';
import { filterTodos, isFilter } from './filter';
import { moveFilterIndicator } from './filterIndicator';
import { describeTasksLeft, renderProgress } from './progress';
import { load, remove, save } from './storage';
import {
  renderTodos,
  setActiveFilter,
  setErrorMessage,
  setFilterCounts,
  setInputError,
  type TodoItemHandlers,
} from './render';
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
  onRemove: async (id) => {
    const item = findTodoItem(id);
    if (item) await animateOut(item, 'leaving');

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

const findTodoItem = (id: number): HTMLElement | null =>
  elements.todoList.querySelector<HTMLElement>(`[data-id="${id}"]`);

const activeFilterButton = (): HTMLButtonElement | null =>
  [...elements.filterButtons].find((button) => button.dataset.filter === currentFilter) ?? null;

const showFilterIndicator = (target: HTMLButtonElement | null): void => {
  moveFilterIndicator(elements.filterIndicator, elements.filterButtons, target);
};

const selectDueDate = (day: string | null): void => {
  selectedDueDate = day;
  render();
};

const render = (): void => {
  const todos = store.getAll();
  const visibleTodos = filterTodos(todos, currentFilter);
  const today = toDateKey(new Date());
  const progress = store.getProgress();

  renderDatePicker(elements.datePicker, today, selectedDueDate, selectDueDate);
  renderTodos(elements.todoList, visibleTodos, handlers, editingId, today);
  renderEmptyState(elements.emptyState, getEmptyMessage(todos.length, visibleTodos.length, currentFilter));
  setActiveFilter(elements.filterButtons, currentFilter);
  // Keep the indicator on the hovered button while the mouse is over the filters
  if (!elements.filters.matches(':hover')) showFilterIndicator(activeFilterButton());
  setFilterCounts(elements.filterButtons, {
    all: todos.length,
    active: filterTodos(todos, 'active').length,
    completed: filterTodos(todos, 'completed').length,
  });
  renderProgress(elements.progress, progress);
  elements.tasksLeft.textContent = describeTasksLeft(progress);
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

// Text widths change once the web font has loaded, so place the indicator again, then let it slide from now on
document.fonts.ready.then(() => {
  showFilterIndicator(activeFilterButton());
  requestAnimationFrame(() => elements.filterIndicator.classList.add('ready'));
});
window.addEventListener('resize', () => showFilterIndicator(activeFilterButton()));

elements.filterButtons.forEach((button) => {
  button.addEventListener('mouseenter', () => showFilterIndicator(button));
  button.addEventListener('focus', () => showFilterIndicator(button));
});
elements.filters.addEventListener('mouseleave', () => showFilterIndicator(activeFilterButton()));
elements.filters.addEventListener('focusout', () => showFilterIndicator(activeFilterButton()));

// Background flowers: they start in the design's layout plus a few small ones at random spots,
// then each one wilts and blooms again somewhere new on its own random timer
const bigFlowers = createMainFlowerSpecs().map(createFlower);
const smallFlowers = Array.from({ length: 3 }, () => createFlower(createRandomFlowerSpec()));
elements.decor.append(...bigFlowers, ...smallFlowers);

if (!prefersReducedMotion()) {
  bigFlowers.forEach((flower) => keepReblooming(flower, createRandomBigFlowerSpec));
  smallFlowers.forEach((flower) => keepReblooming(flower, createRandomFlowerSpec));
}

elements.themeToggle.addEventListener('click', () => {
  theme = toggleTheme(theme);
  save(THEME_KEY, theme);
  applyTheme(document.documentElement, elements.themeToggle, theme);
  // Without a custom color the picker should show the new theme's default
  applyBackground(elements.background, backgroundColor, theme);
});

const selectBackground = (color: string | null): void => {
  backgroundColor = color;
  if (color) {
    save(BACKGROUND_KEY, color);
  } else {
    remove(BACKGROUND_KEY);
  }
  applyBackground(elements.background, backgroundColor, theme);
};

elements.background.swatches.forEach((swatch) => {
  swatch.addEventListener('click', () => selectBackground(getSwatchColor(swatch)));
});

elements.background.picker.addEventListener('input', () => selectBackground(elements.background.picker.value));

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
    restartAnimation(elements.todoInput, 'shake');
    return;
  }

  const todo = store.add(text, selectedDueDate ?? undefined);
  selectedDueDate = null;
  saveAndRender();
  findTodoItem(todo.id)?.classList.add('entering');
  elements.todoInput.value = '';
  setErrorMessage(elements.errorMessage, '');
  setInputError(elements.todoInput, false);
});
