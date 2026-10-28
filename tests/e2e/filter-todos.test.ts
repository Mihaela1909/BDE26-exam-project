import { Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItems = Selector('.todo-item');
const filterButton = (filter: string): Selector => Selector(`.filter-button[data-filter="${filter}"]`);

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
  await t.click(filterButton('active'));

  await t
    .expect(filterButton('active').hasClass('active')).ok()
    .expect(todoItems.count).eql(2)
    .expect(todoItems.nth(0).find('.todo-text').innerText).eql('Buy milk')
    .expect(todoItems.nth(1).find('.todo-text').innerText).eql('Read book');
});

test('choosing Completed shows only completed todos', async (t) => {
  await t.click(filterButton('completed'));

  await t
    .expect(filterButton('completed').hasClass('active')).ok()
    .expect(todoItems.count).eql(1)
    .expect(todoItems.nth(0).find('.todo-text').innerText).eql('Walk dog');

  await t.click(filterButton('all'));

  await t.expect(todoItems.count).eql(3);
});
