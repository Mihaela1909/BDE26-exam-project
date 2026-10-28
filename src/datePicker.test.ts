import { describe, expect, it, vi } from 'vitest';
import { renderDatePicker, WEEK_STRIP_DAYS, type DatePickerElements } from './datePicker';

const createElements = (): DatePickerElements => ({
  label: document.createElement('span'),
  clearButton: document.createElement('button'),
  weekStrip: document.createElement('div'),
  dateInput: Object.assign(document.createElement('input'), { type: 'date' }),
  monthName: document.createElement('span'),
  year: document.createElement('span'),
});

const dayButton = (elements: DatePickerElements, day: string): HTMLButtonElement =>
  elements.weekStrip.querySelector<HTMLButtonElement>(`[data-date="${day}"]`)!;

describe('renderDatePicker', () => {
  it('shows "Today is:" and highlights today when nothing is picked', () => {
    const elements = createElements();
    renderDatePicker(elements, '2026-10-27', null, () => {});

    expect(elements.label.textContent).toBe('Today is:');
    expect(elements.clearButton.hidden).toBe(true);
    expect(elements.weekStrip.children).toHaveLength(WEEK_STRIP_DAYS);
    expect(dayButton(elements, '2026-10-27').classList.contains('today')).toBe(true);
    expect(elements.weekStrip.querySelector('.selected')).toBeNull();
  });

  it('shows "Due on:" with the picked day and the clear button', () => {
    const elements = createElements();
    renderDatePicker(elements, '2026-10-27', '2026-10-30', () => {});

    expect(elements.label.textContent).toBe('Due on: Fri 30 Oct');
    expect(elements.clearButton.hidden).toBe(false);
    expect(dayButton(elements, '2026-10-30').classList.contains('selected')).toBe(true);
    expect(dayButton(elements, '2026-10-27').classList.contains('today')).toBe(true);
  });

  it("shows today's month and year in the month tile", () => {
    const elements = createElements();
    renderDatePicker(elements, '2026-11-30', null, () => {});

    expect(elements.monthName.textContent).toBe('Nov');
    expect(elements.year.textContent).toBe('2026');
  });

  it('picks a day when it is clicked, and un-picks it when clicked again', () => {
    const onSelect = vi.fn();
    const elements = createElements();

    renderDatePicker(elements, '2026-10-27', null, onSelect);
    dayButton(elements, '2026-10-29').click();
    expect(onSelect).toHaveBeenLastCalledWith('2026-10-29');

    renderDatePicker(elements, '2026-10-27', '2026-10-29', onSelect);
    dayButton(elements, '2026-10-29').click();
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });
});
