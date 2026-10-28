/** Whether the user asked their system to reduce motion. */
export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Plays the CSS animation in `className` again, even if the element already has that class. */
export const restartAnimation = (element: HTMLElement, className: string): void => {
  element.classList.remove(className);
  void element.offsetWidth; // Reading the layout makes the browser notice the class was removed
  element.classList.add(className);
};

/**
 * Adds `className` to play an exit animation and waits until it has finished.
 * @param fallbackMs resolves after this time anyway, in case the animation never runs
 */
export const animateOut = (element: HTMLElement, className: string, fallbackMs = 400): Promise<void> =>
  new Promise((resolve) => {
    const done = (): void => {
      clearTimeout(timeout);
      resolve();
    };
    const timeout = setTimeout(done, fallbackMs);

    element.addEventListener('animationend', done, { once: true });
    element.classList.add(className);
  });
