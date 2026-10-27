import './style.css'
import { elements } from './dom';
import { renderTodos, setErrorMessage, setInputError } from './render';
import { TodoStore } from './TodoStore';
import { validateTodoText } from './validation';

const store = new TodoStore();

const render = (): void => {
  renderTodos(elements.todoList, store.getAll(), (id) => {
    store.remove(id);
    render();
  });
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
