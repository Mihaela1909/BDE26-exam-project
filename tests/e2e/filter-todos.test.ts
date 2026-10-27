import { Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItems = Selector('.todo-item');
const filterButton = (label: string): Selector => Selector('.filter-button').withExactText(label);

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

const completeTodo = async (text: string): Promise<void> => {
  await t.click(todoItems.withText(text).find('.toggle-checkbox'));
};

fixture('Filter todos').page('http://127.0.0.1:5173').beforeEach(async () => {
  await addTodo('Buy milk');
  await addTodo('Walk dog');
  await addTodo('Read book');
  await completeTodo('Walk dog');
});

test('choosing Active shows only todos that are not completed', async (t) => {
  await t.click(filterButton('Active'));

  await t
    .expect(filterButton('Active').hasClass('active')).ok()
    .expect(todoItems.count).eql(2)
    .expect(todoItems.nth(0).find('span').innerText).eql('Buy milk')
    .expect(todoItems.nth(1).find('span').innerText).eql('Read book');
});

test('choosing Completed shows only completed todos', async (t) => {
  await t.click(filterButton('Completed'));

  await t
    .expect(filterButton('Completed').hasClass('active')).ok()
    .expect(todoItems.count).eql(1)
    .expect(todoItems.nth(0).find('span').innerText).eql('Walk dog');

  await t.click(filterButton('All'));

  await t.expect(todoItems.count).eql(3);
});
