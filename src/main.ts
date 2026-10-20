import './style.css'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [];

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todolist = document.getElementById('todo-list') as HTMLUListElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

const setErrorMessage = (message: string): void => {
  errorMessage.textContent = message;
  errorMessage.style.display = message ? 'block' : 'none';
};

const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  renderTodos();
};

const addRemoveButtonListener = (li: HTMLLIElement, id: number): void => {
  const removeButton = li.querySelector('button');
  removeButton?.addEventListener('click', () => removeTodo(id));
};

const renderTodos = (): void => {
  todolist.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <span>${todo.text}</span>
      <button type="button">remove</button>
    `;

    addRemoveButtonListener(li, todo.id);
    todolist.appendChild(li);
  });
};

const removeTodo = (id: number): void => {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
};

renderTodos();

todoForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    setErrorMessage('Please enter a todo item.');
    return;
  }

  addTodo(text);
  todoInput.value = '';
  setErrorMessage('');
});