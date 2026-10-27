import { Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItems = Selector('.todo-item');
const progressBar = Selector('#progress-bar');
const progressText = Selector('#progress-text');
const progressHeading = Selector('#progress-heading');

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

const completeTodo = async (text: string): Promise<void> => {
  await t.click(todoItems.withText(text).find('.toggle-checkbox'));
};

fixture('Progress bar').page('http://127.0.0.1:5173');

test('completing a todo increases the progress', async (t) => {
  await addTodo('Buy milk');
  await addTodo('Walk dog');

  await completeTodo('Buy milk');

  await t
    .expect(progressBar.getAttribute('aria-valuenow')).eql('50')
    .expect(progressText.innerText).eql('1 of 2 · 50%');

  await completeTodo('Walk dog');

  await t
    .expect(progressBar.getAttribute('aria-valuenow')).eql('100')
    .expect(progressText.innerText).eql('2 of 2 · 100%')
    .expect(progressHeading.innerText).eql('all done!');
});

test('progress shows 0% with no completed todos', async (t) => {
  await t.expect(progressText.innerText).eql('0 of 0 · 0%');

  await addTodo('Buy milk');
  await addTodo('Walk dog');

  await t
    .expect(progressBar.getAttribute('aria-valuenow')).eql('0')
    .expect(progressText.innerText).eql('0 of 2 · 0%');
});
