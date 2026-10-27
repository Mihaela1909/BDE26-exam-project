import type { Progress } from './types';

/** The page elements that make up the progress bar. */
export interface ProgressElements {
  bar: HTMLElement;
  fill: HTMLElement;
  text: HTMLElement;
}

/** Turns `[done, total]` into a whole percentage; an empty list counts as 0%. */
export const toPercentage = ([done, total]: Progress): number =>
  total === 0 ? 0 : Math.round((done / total) * 100);

/** Describes the progress in words, e.g. `2 of 4 done · 50%`. */
export const describeProgress = (progress: Progress): string => {
  const [done, total] = progress;
  const percentage = toPercentage(progress);

  if (total > 0 && done === total) return `All done! · ${percentage}%`;
  return `${done} of ${total} done · ${percentage}%`;
};

/** Updates the bar width, its screen reader value and the text below it. */
export const renderProgress = (elements: ProgressElements, progress: Progress): void => {
  const percentage = toPercentage(progress);

  elements.fill.style.width = `${percentage}%`;
  elements.bar.setAttribute('aria-valuenow', String(percentage));
  elements.text.textContent = describeProgress(progress);
};
