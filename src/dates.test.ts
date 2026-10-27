import { describe, expect, it } from 'vitest';
import { formatDate, formatShortDate, fromDateKey, getDaysFrom, isOverdue, toDateKey } from './dates';

describe('toDateKey / fromDateKey', () => {
  it('turns a date into YYYY-MM-DD with leading zeros', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('turns a key back into the same local date', () => {
    expect(toDateKey(fromDateKey('2026-10-27'))).toBe('2026-10-27');
  });
});

describe('getDaysFrom', () => {
  it('returns consecutive days across a month end', () => {
    expect(getDaysFrom('2026-10-30', 4)).toEqual(['2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02']);
  });
});

describe('formatDate', () => {
  it('shows weekday, day and month', () => {
    expect(formatDate('2026-10-30')).toBe('Fri 30 Oct');
  });

  it('can leave out the weekday', () => {
    expect(formatShortDate('2026-12-02')).toBe('2 Dec');
  });
});

describe('isOverdue', () => {
  const today = '2026-10-27';

  it('is true for an open todo due before today', () => {
    expect(isOverdue({ id: 1, text: 'a', completed: false, dueDate: '2026-10-26' }, today)).toBe(true);
  });

  it('is false for a todo due today or later', () => {
    expect(isOverdue({ id: 1, text: 'a', completed: false, dueDate: today }, today)).toBe(false);
    expect(isOverdue({ id: 1, text: 'a', completed: false, dueDate: '2026-10-28' }, today)).toBe(false);
  });

  it('is false for a completed todo, even when the date has passed', () => {
    expect(isOverdue({ id: 1, text: 'a', completed: true, dueDate: '2026-10-26' }, today)).toBe(false);
  });

  it('is false for a todo without a due date', () => {
    expect(isOverdue({ id: 1, text: 'a', completed: false }, today)).toBe(false);
  });
});
