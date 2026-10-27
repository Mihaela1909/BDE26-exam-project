import './style.css'
import { elements } from './dom';
import { renderTodos, setErrorMessage, setInputError, type TodoItemHandlers } from './render';
import { TodoStore } from './TodoStore';
import { validateTodoText } from './validation';

const store = new TodoStore();
let editingId: number | null = null;

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
  renderTodos(elements.todoList, store.getAll(), handlers, editingId);
};

render();

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
