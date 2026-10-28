import { ClientFunction, Selector } from 'testcafe';

const url = 'http://127.0.0.1:5173';
const body = Selector('body');
const colorPicker = Selector('#colorPicker');
const defaultSwatch = Selector('#reset-background');
const orangeSwatch = Selector('.swatch[data-color="#e39b4f"]');
const customSwatch = Selector('#custom-swatch');

// Start from the light theme, whatever the computer's light/dark setting is
const saveLightTheme = ClientFunction(() => localStorage.setItem('theme', JSON.stringify('light')));

// The browser's color picker window can't be automated, so set the value and send the event it would send
const chooseColor = ClientFunction((color: string) => {
  const picker = document.getElementById('colorPicker') as HTMLInputElement;
  picker.value = color;
  picker.dispatchEvent(new Event('input', { bubbles: true }));
});

fixture('Background color picker').page(url).beforeEach(async (t) => {
  await saveLightTheme();
  await t.navigateTo(url);
});

test('choosing a color changes the page background to that color', async (t) => {
  await t.click(orangeSwatch);

  await t
    .expect(body.getStyleProperty('background-color')).eql('rgb(227, 155, 79)')
    .expect(orangeSwatch.getAttribute('aria-pressed')).eql('true');

  await chooseColor('#ff0000');

  await t
    .expect(body.getStyleProperty('background-color')).eql('rgb(255, 0, 0)')
    .expect(customSwatch.hasClass('selected')).ok();

  await t.navigateTo(url);

  await t.expect(body.getStyleProperty('background-color')).eql('rgb(255, 0, 0)');

  await t.click(defaultSwatch);

  await t
    .expect(body.getStyleProperty('background-color')).eql('rgb(181, 230, 251)')
    .expect(defaultSwatch.getAttribute('aria-pressed')).eql('true');
});

test('the color picker is visible and has a default value', async (t) => {
  await t
    .expect(colorPicker.visible).ok()
    .expect(colorPicker.value).eql('#b5e6fb')
    .expect(defaultSwatch.getAttribute('aria-pressed')).eql('true');
});
