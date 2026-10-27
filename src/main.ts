import './style.css'
import { elements } from './dom';
import { filterTodos, isFilter } from './filter';
import { renderTodos, setActiveFilter, setErrorMessage, setInputError, type TodoItemHandlers } from './render';
import { TodoStore } from './TodoStore';
import type { Filter } from './types';
import { validateTodoText } from './validation';

const store = new TodoStore();
let editingId: number | null = null;
let currentFilter: Filter = 'all';

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
  onSave: (id, text) => {
    store.updateText(id, text);
    editingId = null;
    render();
  },
  onCancel: () => {
    editingId = null;
    render();
  },
};

const render = (): void => {
  const todos = store.getAll();

  renderTodos(elements.todoList, filterTodos(todos, currentFilter), handlers, editingId);
  setActiveFilter(elements.filterButtons, currentFilter);
  elements.clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
};

render();

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

  store.add(text);
  render();
  elements.todoInput.value = '';
  setErrorMessage(elements.errorMessage, '');
  setInputError(elements.todoInput, false);
});
