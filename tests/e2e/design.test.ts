import { ClientFunction, Selector, t } from 'testcafe';

const input = Selector('#todo-input');
const todoItems = Selector('.todo-item');
const emptyState = Selector('#empty-state');
const tasksLeft = Selector('#tasks-left');
const filterCount = (filter: string): Selector => Selector(`.filter-button[data-filter="${filter}"] .filter-count`);

const addTodo = async (text: string): Promise<void> => {
  await t.typeText(input, text).pressKey('enter');
};

fixture('Design').page('http://127.0.0.1:5173');

test('an empty list shows the flower empty state', async (t) => {
  await t
    .expect(emptyState.visible).ok()
    .expect(emptyState.find('.empty-title').innerText).eql('no todos yet')
    .expect(Selector('#clear-all').hasAttribute('disabled')).ok();

  await addTodo('Buy milk');

  await t.expect(emptyState.visible).notOk();

  await t.click(Selector('.filter-button[data-filter="completed"]'));

  await t
    .expect(emptyState.visible).ok()
    .expect(emptyState.find('.empty-title').innerText).eql('nothing completed yet');
});

test('filter counts and tasks left follow the list', async (t) => {
  await addTodo('Buy milk');
  await addTodo('Walk dog');
  await addTodo('Read book');
  await t.click(todoItems.withText('Walk dog').find('.toggle-checkbox'));

  await t
    .expect(filterCount('all').innerText).eql('(3)')
    .expect(filterCount('active').innerText).eql('(2)')
    .expect(filterCount('completed').innerText).eql('(1)')
    .expect(tasksLeft.innerText).eql('2 Tasks left to do');

  await t.click(todoItems.withText('Buy milk').find('.toggle-checkbox'));

  await t.expect(tasksLeft.innerText).eql('1 Task left to do');
});

test('the blue filter highlight follows the mouse and goes back to the selected filter', async (t) => {
  const button = (filter: string): Selector => Selector(`.filter-button[data-filter="${filter}"]`);

  await t.hover(button('completed'));

  await t
    .expect(button('completed').hasClass('highlighted')).ok()
    .expect(button('all').hasClass('highlighted')).notOk()
    .expect(button('all').hasClass('active')).ok();

  await t.hover(Selector('#todo-input'));

  await t
    .expect(button('all').hasClass('highlighted')).ok()
    .expect(button('completed').hasClass('highlighted')).notOk();
});

// Runs one flower through two wilt-and-bloom rounds in the browser and reports which CSS animation plays each time
const flowerAnimations = ClientFunction(() => {
  const flower = document.querySelector('.flower') as HTMLElement;
  const animation = (): string => getComputedStyle(flower).animationName;
  const names = [animation()];

  for (let round = 0; round < 2; round++) {
    flower.classList.remove('reblooming');
    flower.classList.add('wilting');
    names.push(animation());

    flower.classList.remove('wilting');
    void flower.offsetWidth;
    flower.classList.add('reblooming');
    names.push(animation());
  }
  return names;
});

test('background flowers bloom in and wilt out in every round', async (t) => {
  await t.expect(flowerAnimations()).eql(['bloom, sway', 'wilt', 'bloom, sway', 'wilt', 'bloom, sway']);
});
