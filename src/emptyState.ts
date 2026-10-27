import type { Filter } from './types';

/** What the list shows instead of todos when there is nothing to show. */
export interface EmptyMessage {
  title: string;
  text: string;
}

/** The page elements that make up the empty state. */
export interface EmptyStateElements {
  container: HTMLElement;
  title: HTMLElement;
  text: HTMLElement;
}

/**
 * Picks the message for an empty list.
 * @param total how many todos there are in total
 * @param visible how many todos the current filter shows
 * @returns the message, or `null` when there are todos to show
 */
export const getEmptyMessage = (total: number, visible: number, filter: Filter): EmptyMessage | null => {
  if (visible > 0) return null;
  if (total === 0) return { title: 'no todos yet', text: 'Add one above — and do it with Mi.' };
  if (filter === 'completed') return { title: 'nothing completed yet', text: 'Tick a todo once it is done.' };
  return { title: 'nothing left to do', text: 'Every todo is done — nice work!' };
};

/** Shows `message` in the empty state, or hides it when the message is `null`. */
export const renderEmptyState = (elements: EmptyStateElements, message: EmptyMessage | null): void => {
  elements.container.hidden = message === null;
  elements.title.textContent = message?.title ?? '';
  elements.text.textContent = message?.text ?? '';
};
