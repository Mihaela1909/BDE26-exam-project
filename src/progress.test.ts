import { describe, expect, it } from 'vitest';
import {
  describeProgress,
  describeTasksLeft,
  isAllDone,
  renderProgress,
  toPercentage,
  type ProgressElements,
} from './progress';

const createElements = (): ProgressElements => ({
  heading: document.createElement('h2'),
  bar: document.createElement('div'),
  fill: document.createElement('div'),
  text: document.createElement('p'),
});

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
    expect(describeProgress([2, 4])).toBe('2 of 4 · 50%');
  });

  it('shows 0% when nothing is done', () => {
    expect(describeProgress([0, 3])).toBe('0 of 3 · 0%');
    expect(describeProgress([0, 0])).toBe('0 of 0 · 0%');
  });
});

describe('isAllDone', () => {
  it('is true only when there are todos and all are completed', () => {
    expect(isAllDone([3, 3])).toBe(true);
    expect(isAllDone([2, 3])).toBe(false);
    expect(isAllDone([0, 0])).toBe(false);
  });
});

describe('describeTasksLeft', () => {
  it('counts the open todos', () => {
    expect(describeTasksLeft([2, 4])).toBe('2 Tasks left to do');
    expect(describeTasksLeft([0, 0])).toBe('0 Tasks left to do');
  });

  it('uses the singular for one task', () => {
    expect(describeTasksLeft([2, 3])).toBe('1 Task left to do');
  });
});

describe('renderProgress', () => {
  it('sets the bar width, its aria value and the text', () => {
    const elements = createElements();

    renderProgress(elements, [1, 4]);

    expect(elements.heading.textContent).toBe('Your progress:');
    expect(elements.fill.style.width).toBe('25%');
    expect(elements.bar.getAttribute('aria-valuenow')).toBe('25');
    expect(elements.text.textContent).toBe('1 of 4 · 25%');
  });

  it('celebrates when everything is done', () => {
    const elements = createElements();

    renderProgress(elements, [4, 4]);

    expect(elements.heading.textContent).toBe('all done!');
    expect(elements.heading.classList.contains('all-done')).toBe(true);
    expect(elements.text.textContent).toBe('4 of 4 · 100%');
  });
});
