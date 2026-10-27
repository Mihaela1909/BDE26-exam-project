import { describe, expect, it } from 'vitest';
import { applyTheme, isTheme, Theme, toggleTheme } from './theme';

describe('toggleTheme', () => {
  it('switches light to dark and dark to light', () => {
    expect(toggleTheme(Theme.Light)).toBe(Theme.Dark);
    expect(toggleTheme(Theme.Dark)).toBe(Theme.Light);
  });
});

describe('isTheme', () => {
  it('accepts the theme values', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isTheme('blue')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe('applyTheme', () => {
  it('sets data-theme and offers to switch back to light in dark mode', () => {
    const root = document.createElement('html');
    const button = document.createElement('button');

    applyTheme(root, button, Theme.Dark);

    expect(root.dataset.theme).toBe('dark');
    expect(button.textContent).toBe('☀️');
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('offers to switch to dark in light mode', () => {
    const root = document.createElement('html');
    const button = document.createElement('button');

    applyTheme(root, button, Theme.Light);

    expect(root.dataset.theme).toBe('light');
    expect(button.textContent).toBe('🌙');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
