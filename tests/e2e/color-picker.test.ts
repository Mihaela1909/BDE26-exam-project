import { ClientFunction, Selector } from 'testcafe';

const url = 'http://127.0.0.1:5173';
const body = Selector('body');
const colorPicker = Selector('#colorPicker');
const resetButton = Selector('#reset-background');

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
  await chooseColor('#ff8800');

  await t
    .expect(body.getStyleProperty('background-color')).eql('rgb(255, 136, 0)')
    .expect(resetButton.visible).ok();

  await t.navigateTo(url);

  await t.expect(body.getStyleProperty('background-color')).eql('rgb(255, 136, 0)');

  await t.click(resetButton);

  await t
    .expect(body.getStyleProperty('background-color')).eql('rgb(244, 244, 244)')
    .expect(resetButton.visible).notOk();
});

test('the color picker is visible and has a default value', async (t) => {
  await t
    .expect(colorPicker.visible).ok()
    .expect(colorPicker.value).eql('#f4f4f4')
    .expect(resetButton.visible).notOk();
});
