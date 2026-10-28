import { Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItem = Selector('.todo-item');
const editInput = Selector('.edit-input');

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

fixture('Edit todo').page('http://127.0.0.1:5173');

test('editing a todo and clicking Save shows the new text', async (t) => {
  await addTodo('Buy milk');

  await t
    .click(todoItem.find('.edit-button'))
    .typeText(editInput, 'Buy oat milk', { replace: true })
    .click(todoItem.find('.save-button'));

  await t
    .expect(editInput.exists).notOk()
    .expect(todoItem.find('.todo-text').innerText).eql('Buy oat milk');
});

test('editing a todo and clicking Cancel keeps the original text', async (t) => {
  await addTodo('Buy milk');

  await t
    .click(todoItem.find('.edit-button'))
    .typeText(editInput, 'Something else', { replace: true })
    .click(todoItem.find('.cancel-button'));

  await t
    .expect(editInput.exists).notOk()
    .expect(todoItem.find('.todo-text').innerText).eql('Buy milk');
});
