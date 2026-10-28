import { formatDate, fromDateKey, getDaysFrom } from './dates';

/** How many days the week strip shows, starting with today. */
export const WEEK_STRIP_DAYS = 7;

/** The page elements that make up the due date picker. */
export interface DatePickerElements {
  label: HTMLElement;
  clearButton: HTMLButtonElement;
  weekStrip: HTMLElement;
  dateInput: HTMLInputElement;
  monthName: HTMLElement;
  year: HTMLElement;
}

const createDayButton = (
  day: string,
  today: string,
  selected: string | null,
  onSelect: (day: string | null) => void,
): HTMLButtonElement => {
  const date = fromDateKey(day);

  const name = document.createElement('span');
  name.className = 'day-name';
  name.textContent = date.toLocaleDateString('en-GB', { weekday: 'short' });

  const number = document.createElement('span');
  number.className = 'day-number';
  number.textContent = String(date.getDate());

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'day-button';
  button.dataset.date = day;
  button.classList.toggle('today', day === today);
  button.classList.toggle('selected', day === selected);
  button.setAttribute('aria-pressed', String(day === selected));
  button.setAttribute('aria-label', formatDate(day));
  button.append(name, number);
  // Clicking the picked day again un-picks it
  button.addEventListener('click', () => onSelect(day === selected ? null : day));
  return button;
};

/**
 * Draws the label, the month tile and the week strip for the due date of the next todo.
 * @param today today's date as `YYYY-MM-DD`
 * @param selected the picked due date, or `null` when none is picked
 * @param onSelect called with the clicked day, or `null` when the picked day is clicked again
 */
export const renderDatePicker = (
  elements: DatePickerElements,
  today: string,
  selected: string | null,
  onSelect: (day: string | null) => void,
): void => {
  elements.label.textContent = selected ? `Due on: ${formatDate(selected)}` : 'Today is:';
  elements.clearButton.hidden = selected === null;
  elements.dateInput.value = selected ?? '';

  const todayDate = fromDateKey(today);
  elements.monthName.textContent = todayDate.toLocaleDateString('en-GB', { month: 'short' });
  elements.year.textContent = String(todayDate.getFullYear());

  elements.weekStrip.replaceChildren(
    ...getDaysFrom(today, WEEK_STRIP_DAYS).map((day) => createDayButton(day, today, selected, onSelect)),
  );
};
