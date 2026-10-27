import { Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItem = Selector('.todo-item');
const dateLabel = Selector('#date-label');
const dayButtons = Selector('.day-button');

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

const yesterday = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-');
};

fixture('Due dates').page('http://127.0.0.1:5173');

test('adding a todo with a due date displays that date', async (t) => {
  const tomorrow = dayButtons.nth(1);
  const tomorrowLabel = await tomorrow.getAttribute('aria-label');

  await t.click(tomorrow);
  await t
    .expect(tomorrow.hasClass('selected')).ok()
    .expect(dateLabel.innerText).eql(`Due on: ${tomorrowLabel}`);

  await addTodo('Buy milk');

  await t
    .expect(todoItem.find('.due-date').innerText).eql(tomorrowLabel ?? '')
    .expect(todoItem.hasClass('overdue')).notOk()
    .expect(dateLabel.innerText).eql('Today is:');
});

test('a todo with a past due date is highlighted as overdue', async (t) => {
  await addTodo('Pay rent');
  await t.expect(todoItem.find('.due-date').innerText).eql('No date');

  await t
    .click(todoItem.find('.edit-button'))
    .typeText(todoItem.find('.edit-date'), yesterday())
    .click(todoItem.find('.save-button'));

  await t.expect(todoItem.hasClass('overdue')).ok();

  await t.click(todoItem.find('.toggle-checkbox'));

  await t.expect(todoItem.hasClass('overdue')).notOk();
});
