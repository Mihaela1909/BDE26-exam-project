import type { Progress } from './types';

/** The page elements that make up the progress section. */
export interface ProgressElements {
  heading: HTMLElement;
  bar: HTMLElement;
  fill: HTMLElement;
  text: HTMLElement;
}

/** Turns `[done, total]` into a whole percentage; an empty list counts as 0%. */
export const toPercentage = ([done, total]: Progress): number =>
  total === 0 ? 0 : Math.round((done / total) * 100);

/** Describes the progress in numbers, e.g. `2 of 4 · 50%`. */
export const describeProgress = (progress: Progress): string => {
  const [done, total] = progress;
  return `${done} of ${total} · ${toPercentage(progress)}%`;
};

/** A list is all done when it has todos and every one of them is completed. */
export const isAllDone = ([done, total]: Progress): boolean => total > 0 && done === total;

/** Describes how many todos are still open, e.g. `2 Tasks left to do`. */
export const describeTasksLeft = ([done, total]: Progress): string => {
  const left = total - done;
  return `${left} ${left === 1 ? 'Task' : 'Tasks'} left to do`;
};

/** Updates the heading, the bar width, its screen reader value and the numbers next to it. */
export const renderProgress = (elements: ProgressElements, progress: Progress): void => {
  const percentage = toPercentage(progress);
  const allDone = isAllDone(progress);

  elements.heading.textContent = allDone ? 'all done!' : 'Your progress:';
  elements.heading.classList.toggle('all-done', allDone);
  elements.fill.style.width = `${percentage}%`;
  elements.bar.setAttribute('aria-valuenow', String(percentage));
  elements.text.textContent = describeProgress(progress);
};
