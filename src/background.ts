import { Theme } from './theme';

/** The default page background of each theme; keep in sync with `--body-background-color` in style.css. */
export const THEME_BACKGROUNDS: Record<Theme, string> = {
  [Theme.Light]: '#b5e6fb',
  [Theme.Dark]: '#011627',
};

/** The page elements that make up the background color picker. */
export interface BackgroundElements {
  root: HTMLElement;
  /** Ready-made colors in `data-color`; the default swatch has an empty `data-color` */
  swatches: Iterable<HTMLButtonElement>;
  /** The eyedropper swatch around the color input, for any other color */
  customSwatch: HTMLElement;
  picker: HTMLInputElement;
}

/** Checks whether `value` is a color like `#1a2b3c`, the format `<input type="color">` uses. */
export const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

/** Reads the color a swatch stands for; `null` means the theme's default background. */
export const getSwatchColor = (swatch: HTMLButtonElement): string | null => swatch.dataset.color || null;

/**
 * Colors the page behind the card with `color`, or goes back to the theme's default when `color` is `null`.
 * The card keeps its theme colors, so it stays readable on any background.
 */
export const applyBackground = (elements: BackgroundElements, color: string | null, theme: Theme): void => {
  if (color) {
    elements.root.style.setProperty('--body-background-color', color);
  } else {
    elements.root.style.removeProperty('--body-background-color');
  }
  elements.root.classList.toggle('custom-background', color !== null);
  elements.picker.value = color ?? THEME_BACKGROUNDS[theme];

  let matchesSwatch = false;
  for (const swatch of elements.swatches) {
    const isSelected = getSwatchColor(swatch) === color;
    swatch.setAttribute('aria-pressed', String(isSelected));
    matchesSwatch ||= isSelected;
  }
  elements.customSwatch.classList.toggle('selected', !matchesSwatch);
};
