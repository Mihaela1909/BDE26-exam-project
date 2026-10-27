import { Selector } from 'testcafe';

const input = Selector('#todo-input');
const addButton = Selector('button').withText('Add');
const todoItems = Selector('.todo-item');
const errorMessage = Selector('#error-message');

fixture('Add todo').page('http://127.0.0.1:5173');

test('typing a todo and submitting adds it to the list', async (t) => {
  await t.typeText(input, 'Buy milk').click(addButton);

  await t
    .expect(todoItems.count).eql(1)
    .expect(todoItems.nth(0).find('span').innerText).eql('Buy milk')
    .expect(input.value).eql('');
});

test('submitting empty input shows the error and does not add a todo', async (t) => {
  await t.typeText(input, '   ').click(addButton);

  await t
    .expect(errorMessage.visible).ok()
    .expect(errorMessage.innerText).eql('Please enter a todo item.')
    .expect(input.hasClass('input-error')).ok()
    .expect(todoItems.count).eql(0);

  await t.selectText(input).pressKey('delete').typeText(input, 'Buy milk').click(addButton);

  await t
    .expect(errorMessage.visible).notOk()
    .expect(input.hasClass('input-error')).notOk()
    .expect(todoItems.count).eql(1);
});
