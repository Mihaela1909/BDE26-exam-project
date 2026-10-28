import { ClientFunction, Selector } from 'testcafe';

const url = 'http://127.0.0.1:5173';
const html = Selector('html');
const body = Selector('body');
const themeToggle = Selector('#theme-toggle');

const lightBackground = 'rgb(181, 230, 251)';
const darkBackground = 'rgb(1, 22, 39)';

// Without a saved theme the app follows the computer's light/dark setting, so start every test from light
const saveLightTheme = ClientFunction(() => localStorage.setItem('theme', JSON.stringify('light')));

fixture('Dark mode').page(url).beforeEach(async (t) => {
  await saveLightTheme();
  await t.navigateTo(url);
});

test('clicking the toggle switches the page to dark mode', async (t) => {
  await t.expect(html.getAttribute('data-theme')).eql('light');

  await t.click(themeToggle);

  await t
    .expect(html.getAttribute('data-theme')).eql('dark')
    .expect(body.getStyleProperty('background-color')).eql(darkBackground)
    .expect(themeToggle.getAttribute('aria-label')).eql('Switch to light mode');

  await t.navigateTo(url);

  await t.expect(html.getAttribute('data-theme')).eql('dark');
});

test('clicking it again switches back to light mode', async (t) => {
  await t.click(themeToggle).click(themeToggle);

  await t
    .expect(html.getAttribute('data-theme')).eql('light')
    .expect(body.getStyleProperty('background-color')).eql(lightBackground)
    .expect(themeToggle.getAttribute('aria-label')).eql('Switch to dark mode');
});
