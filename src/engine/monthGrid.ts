import type { MonthCell } from './types';

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

export interface GenerateMonthGridOptions {
  year: number;
  minDate?: Date;
  maxDate?: Date;
  /** The currently selected/viewing month (0-11). Used to highlight the active month. */
  selectedMonth?: number;
}

/**
 * Pure, stateless function to generate a 12-cell month grid for the year selector view.
 * Returns an array of MonthCell objects with selection and boundary state.
 */
export function generateMonthGrid({
  year,
  minDate,
  maxDate,
  selectedMonth
}: GenerateMonthGridOptions): MonthCell[] {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const cells: MonthCell[] = [];

  for (let month = 0; month < 12; month++) {
    let isDisabled = false;

    // Boundary check: if entire month is before minDate's month
    if (minDate) {
      const minYear = minDate.getFullYear();
      const minMonth = minDate.getMonth();
      if (year < minYear || (year === minYear && month < minMonth)) {
        isDisabled = true;
      }
    }

    // Boundary check: if entire month is after maxDate's month
    if (maxDate) {
      const maxYear = maxDate.getFullYear();
      const maxMonth = maxDate.getMonth();
      if (year > maxYear || (year === maxYear && month > maxMonth)) {
        isDisabled = true;
      }
    }

    cells.push({
      month,
      label: MONTH_LABELS[month] ?? '',
      isCurrentMonth: year === currentYear && month === currentMonth,
      isSelected: selectedMonth !== undefined && month === selectedMonth,
      isDisabled
    });
  }

  return cells;
}
