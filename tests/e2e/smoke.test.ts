import { Selector } from 'testcafe';

fixture('Smoke test').page('http://127.0.0.1:5173');

test('page loads and shows the title', async (t) => {
  await t.expect(Selector('h1').innerText).eql('My Todo List');
});
