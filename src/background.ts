import { Theme } from './theme';

/** The default page background of each theme; keep in sync with `--body-background-color` in style.css. */
export const THEME_BACKGROUNDS: Record<Theme, string> = {
  [Theme.Light]: '#f4f4f4',
  [Theme.Dark]: '#121212',
};

/** The page elements that make up the background color picker. */
export interface BackgroundElements {
  root: HTMLElement;
  picker: HTMLInputElement;
  resetButton: HTMLButtonElement;
}

/** Checks whether `value` is a color like `#1a2b3c`, the format `<input type="color">` uses. */
export const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);

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

  elements.picker.value = color ?? THEME_BACKGROUNDS[theme];
  elements.resetButton.hidden = color === null;
};
