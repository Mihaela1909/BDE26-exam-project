import { describe, expect, it } from 'vitest';
import { applyBackground, getSwatchColor, isHexColor, THEME_BACKGROUNDS, type BackgroundElements } from './background';
import { Theme } from './theme';

const createSwatch = (color: string): HTMLButtonElement => {
  const swatch = document.createElement('button');
  swatch.dataset.color = color;
  return swatch;
};

const createElements = (): BackgroundElements & { swatches: HTMLButtonElement[] } => ({
  root: document.createElement('html'),
  swatches: [createSwatch('#6aaaf5'), createSwatch(''), createSwatch('#e39b4f')],
  customSwatch: document.createElement('label'),
  picker: Object.assign(document.createElement('input'), { type: 'color' }),
});

const pressed = (elements: { swatches: HTMLButtonElement[] }): string[] =>
  elements.swatches.map((swatch) => swatch.getAttribute('aria-pressed') ?? '');

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

describe('getSwatchColor', () => {
  it('reads the color, and null for the default swatch', () => {
    expect(getSwatchColor(createSwatch('#6aaaf5'))).toBe('#6aaaf5');
    expect(getSwatchColor(createSwatch(''))).toBeNull();
  });
});

describe('applyBackground', () => {
  it('sets a swatch color and marks that swatch as selected', () => {
    const elements = createElements();

    applyBackground(elements, '#e39b4f', Theme.Light);

    expect(elements.root.style.getPropertyValue('--body-background-color')).toBe('#e39b4f');
    expect(elements.root.classList.contains('custom-background')).toBe(true);
    expect(pressed(elements)).toEqual(['false', 'false', 'true']);
    expect(elements.customSwatch.classList.contains('selected')).toBe(false);
  });

  it('marks the eyedropper as selected for a color that has no swatch', () => {
    const elements = createElements();

    applyBackground(elements, '#123456', Theme.Light);

    expect(elements.picker.value).toBe('#123456');
    expect(pressed(elements)).toEqual(['false', 'false', 'false']);
    expect(elements.customSwatch.classList.contains('selected')).toBe(true);
  });

  it('goes back to the theme default and selects the default swatch when the color is null', () => {
    const elements = createElements();
    applyBackground(elements, '#ff8800', Theme.Dark);

    applyBackground(elements, null, Theme.Dark);

    expect(elements.root.style.getPropertyValue('--body-background-color')).toBe('');
    expect(elements.root.classList.contains('custom-background')).toBe(false);
    expect(elements.picker.value).toBe(THEME_BACKGROUNDS[Theme.Dark]);
    expect(pressed(elements)).toEqual(['false', 'true', 'false']);
  });
});
