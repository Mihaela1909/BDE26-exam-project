import { describe, expect, it } from 'vitest';
import { describeProgress, renderProgress, toPercentage, type ProgressElements } from './progress';

describe('toPercentage', () => {
  it('rounds to a whole percentage', () => {
    expect(toPercentage([1, 3])).toBe(33);
    expect(toPercentage([2, 4])).toBe(50);
  });

  it('is 0 for an empty list instead of dividing by zero', () => {
    expect(toPercentage([0, 0])).toBe(0);
  });
});

describe('describeProgress', () => {
  it('shows done, total and percentage', () => {
    expect(describeProgress([2, 4])).toBe('2 of 4 done · 50%');
  });

  it('shows 0% when nothing is done', () => {
    expect(describeProgress([0, 3])).toBe('0 of 3 done · 0%');
    expect(describeProgress([0, 0])).toBe('0 of 0 done · 0%');
  });

  it('celebrates when everything is done', () => {
    expect(describeProgress([3, 3])).toBe('All done! · 100%');
  });
});

describe('renderProgress', () => {
  it('sets the bar width, its aria value and the text', () => {
    const elements: ProgressElements = {
      bar: document.createElement('div'),
      fill: document.createElement('div'),
      text: document.createElement('p'),
    };

    renderProgress(elements, [1, 4]);

    expect(elements.fill.style.width).toBe('25%');
    expect(elements.bar.getAttribute('aria-valuenow')).toBe('25');
    expect(elements.text.textContent).toBe('1 of 4 done · 25%');
  });
});
