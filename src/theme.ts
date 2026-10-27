/** The color themes the app can show. */
export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

/** Checks whether `value` (e.g. loaded from storage) is a valid theme. */
export const isTheme = (value: unknown): value is Theme => Object.values(Theme).includes(value as Theme);

/** Returns the other theme. */
export const toggleTheme = (theme: Theme): Theme => (theme === Theme.Light ? Theme.Dark : Theme.Light);

/**
 * Switches the page to `theme` by setting `data-theme` on `root`, which swaps the CSS color variables.
 * The toggle button shows the theme it switches to.
 */
export const applyTheme = (root: HTMLElement, toggleButton: HTMLButtonElement, theme: Theme): void => {
  const isDark = theme === Theme.Dark;

  root.dataset.theme = theme;
  toggleButton.textContent = isDark ? '☀️' : '🌙';
  toggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  toggleButton.setAttribute('aria-pressed', String(isDark));
};
