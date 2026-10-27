/**
 * Slides the blue pill behind the filter buttons to `target`, and makes `target` the highlighted button.
 * The indicator follows the hovered button, and goes back to the selected one when the mouse leaves.
 */
export const moveFilterIndicator = (
  indicator: HTMLElement,
  buttons: Iterable<HTMLButtonElement>,
  target: HTMLButtonElement | null,
): void => {
  for (const button of buttons) {
    button.classList.toggle('highlighted', button === target);
  }

  if (!target) {
    indicator.hidden = true;
    return;
  }

  indicator.hidden = false;
  indicator.style.setProperty('--indicator-x', `${target.offsetLeft}px`);
  indicator.style.setProperty('--indicator-width', `${target.offsetWidth}px`);
};
