import { Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItem = Selector('.todo-item');
const checkbox = todoItem.find('.toggle-checkbox');

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

const textDecoration = (): Promise<string> => todoItem.find('.todo-text').getStyleProperty('text-decoration-line');

fixture('Toggle completed').page('http://127.0.0.1:5173');

test('clicking the checkbox marks the todo as completed (crossed out)', async (t) => {
  await addTodo('Buy milk');

  await t.click(checkbox);

  await t
    .expect(checkbox.checked).ok()
    .expect(todoItem.hasClass('completed')).ok()
    .expect(textDecoration()).eql('line-through');
});

test('clicking it again marks the todo as not completed', async (t) => {
  await addTodo('Buy milk');

  await t.click(checkbox).click(checkbox);

  await t
    .expect(checkbox.checked).notOk()
    .expect(todoItem.hasClass('completed')).notOk()
    .expect(textDecoration()).eql('none');
});
