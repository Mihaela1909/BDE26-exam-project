import { describe, expect, it } from 'vitest';
import { moveFilterIndicator } from './filterIndicator';

const createButton = (offsetLeft: number, offsetWidth: number): HTMLButtonElement => {
  const button = document.createElement('button');
  // jsdom doesn't lay out the page, so give the buttons a position and width by hand
  Object.defineProperty(button, 'offsetLeft', { value: offsetLeft });
  Object.defineProperty(button, 'offsetWidth', { value: offsetWidth });
  return button;
};

describe('moveFilterIndicator', () => {
  it('moves the indicator under the target button and highlights only that button', () => {
    const indicator = document.createElement('span');
    const buttons = [createButton(0, 100), createButton(100, 120), createButton(220, 140)];

    moveFilterIndicator(indicator, buttons, buttons[1]);

    expect(indicator.style.getPropertyValue('--indicator-x')).toBe('100px');
    expect(indicator.style.getPropertyValue('--indicator-width')).toBe('120px');
    expect(indicator.hidden).toBe(false);
    expect(buttons.map((button) => button.classList.contains('highlighted'))).toEqual([false, true, false]);
  });

  it('hides the indicator when there is no target', () => {
    const indicator = document.createElement('span');

    moveFilterIndicator(indicator, [createButton(0, 100)], null);

    expect(indicator.hidden).toBe(true);
  });
});
