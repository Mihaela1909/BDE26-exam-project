import { describe, expect, it } from 'vitest';
import { applyBackground, isHexColor, THEME_BACKGROUNDS, type BackgroundElements } from './background';
import { Theme } from './theme';

const createElements = (): BackgroundElements => ({
  root: document.createElement('html'),
  picker: Object.assign(document.createElement('input'), { type: 'color' }),
  resetButton: document.createElement('button'),
});

describe('isHexColor', () => {
  it('accepts six-digit hex colors', () => {
    expect(isHexColor('#ff8800')).toBe(true);
    expect(isHexColor('#ABCDEF')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isHexColor('red')).toBe(false);
    expect(isHexColor('#fff')).toBe(false);
    expect(isHexColor(42)).toBe(false);
  });
});

describe('applyBackground', () => {
  it('sets a custom color and shows the reset button', () => {
    const elements = createElements();

    applyBackground(elements, '#ff8800', Theme.Light);

    expect(elements.root.style.getPropertyValue('--body-background-color')).toBe('#ff8800');
    expect(elements.picker.value).toBe('#ff8800');
    expect(elements.resetButton.hidden).toBe(false);
  });

  it('goes back to the theme default when the color is null', () => {
    const elements = createElements();
    applyBackground(elements, '#ff8800', Theme.Dark);

    applyBackground(elements, null, Theme.Dark);

    expect(elements.root.style.getPropertyValue('--body-background-color')).toBe('');
    expect(elements.picker.value).toBe(THEME_BACKGROUNDS[Theme.Dark]);
    expect(elements.resetButton.hidden).toBe(true);
  });
});
