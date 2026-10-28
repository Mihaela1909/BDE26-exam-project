import { describe, expect, it, vi } from 'vitest';
import { animateOut, restartAnimation } from './animations';

describe('restartAnimation', () => {
  it('leaves the element with the animation class', () => {
    const element = document.createElement('div');
    element.classList.add('shake');

    restartAnimation(element, 'shake');

    expect(element.classList.contains('shake')).toBe(true);
  });
});

describe('animateOut', () => {
  it('adds the class and resolves when the animation ends', async () => {
    const element = document.createElement('div');
    const done = animateOut(element, 'leaving');

    expect(element.classList.contains('leaving')).toBe(true);
    element.dispatchEvent(new Event('animationend'));

    await expect(done).resolves.toBeUndefined();
  });

  it('resolves after the fallback time when no animation runs', async () => {
    vi.useFakeTimers();
    const done = animateOut(document.createElement('div'), 'leaving', 300);

    vi.advanceTimersByTime(300);

    await expect(done).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});
