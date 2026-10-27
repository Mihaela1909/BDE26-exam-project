import { Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItems = Selector('.todo-item');

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

const removeTodo = async (text: string): Promise<void> => {
  await t.click(todoItems.withText(text).find('.remove-button'));
};

fixture('Remove todo').page('http://127.0.0.1:5173');

test('clicking Remove deletes that todo from the list', async (t) => {
  await addTodo('Buy milk');
  await t.expect(todoItems.count).eql(1);

  await removeTodo('Buy milk');

  await t.expect(todoItems.count).eql(0);
});

test('removing one todo leaves the other todos untouched', async (t) => {
  await addTodo('Buy milk');
  await addTodo('Walk dog');
  await addTodo('Read book');

  await removeTodo('Walk dog');

  await t
    .expect(todoItems.count).eql(2)
    .expect(todoItems.nth(0).find('span').innerText).eql('Buy milk')
    .expect(todoItems.nth(1).find('span').innerText).eql('Read book');
});
