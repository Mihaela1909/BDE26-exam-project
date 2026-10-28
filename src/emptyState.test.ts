import { describe, expect, it } from 'vitest';
import { getEmptyMessage, renderEmptyState, type EmptyStateElements } from './emptyState';

describe('getEmptyMessage', () => {
  it('returns null when the filter shows todos', () => {
    expect(getEmptyMessage(3, 2, 'active')).toBeNull();
  });

  it('invites the user to add a todo when the list is empty', () => {
    expect(getEmptyMessage(0, 0, 'all')?.title).toBe('no todos yet');
  });

  it('explains an empty Completed filter', () => {
    expect(getEmptyMessage(2, 0, 'completed')?.title).toBe('nothing completed yet');
  });

  it('explains an empty Active filter', () => {
    expect(getEmptyMessage(2, 0, 'active')?.title).toBe('nothing left to do');
  });
});

describe('renderEmptyState', () => {
  const createElements = (): EmptyStateElements => ({
    container: document.createElement('div'),
    title: document.createElement('p'),
    text: document.createElement('p'),
  });

  it('shows the message', () => {
    const elements = createElements();

    renderEmptyState(elements, { title: 'no todos yet', text: 'Add one above.' });

    expect(elements.container.hidden).toBe(false);
    expect(elements.title.textContent).toBe('no todos yet');
    expect(elements.text.textContent).toBe('Add one above.');
  });

  it('hides itself when there is no message', () => {
    const elements = createElements();

    renderEmptyState(elements, null);

    expect(elements.container.hidden).toBe(true);
  });
});
