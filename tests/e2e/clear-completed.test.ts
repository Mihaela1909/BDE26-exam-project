import { Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItems = Selector('.todo-item');
const clearCompletedButton = Selector('#clear-completed');

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

const completeTodo = async (text: string): Promise<void> => {
  await t.click(todoItems.withText(text).find('.toggle-checkbox'));
};

fixture('Clear completed').page('http://127.0.0.1:5173');

test('clicking Clear completed removes all completed todos', async (t) => {
  await addTodo('Buy milk');
  await addTodo('Walk dog');
  await completeTodo('Buy milk');
  await completeTodo('Walk dog');

  await t.click(clearCompletedButton);

  await t
    .expect(todoItems.count).eql(0)
    .expect(clearCompletedButton.hasAttribute('disabled')).ok();
});

test('active (not completed) todos remain after clearing', async (t) => {
  await addTodo('Buy milk');
  await addTodo('Walk dog');
  await addTodo('Read book');
  await completeTodo('Walk dog');

  await t.click(clearCompletedButton);

  await t
    .expect(todoItems.count).eql(2)
    .expect(todoItems.nth(0).find('span').innerText).eql('Buy milk')
    .expect(todoItems.nth(1).find('span').innerText).eql('Read book');
});
