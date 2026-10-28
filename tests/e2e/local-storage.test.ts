import { Selector, t } from 'testcafe';

const url = 'http://127.0.0.1:5173';
const input = Selector('#todo-input');
const todoItems = Selector('.todo-item');
const clearAllButton = Selector('#clear-all');

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

fixture('Local storage').page(url);

test('todos are still shown after reloading the page', async (t) => {
  await addTodo('Buy milk');
  await addTodo('Walk dog');
  await t.click(todoItems.withText('Buy milk').find('.toggle-checkbox'));

  await t.navigateTo(url);

  await t
    .expect(todoItems.count).eql(2)
    .expect(todoItems.nth(0).find('.todo-text').innerText).eql('Buy milk')
    .expect(todoItems.nth(0).hasClass('completed')).ok()
    .expect(todoItems.nth(1).find('.todo-text').innerText).eql('Walk dog');
});

test('Clear all empties the list, and it stays empty after reload', async (t) => {
  await addTodo('Buy milk');
  await addTodo('Walk dog');

  await t.setNativeDialogHandler(() => true).click(clearAllButton);

  await t
    .expect(todoItems.count).eql(0)
    .expect(clearAllButton.hasAttribute('disabled')).ok();

  await t.navigateTo(url);

  await t.expect(todoItems.count).eql(0);
});
