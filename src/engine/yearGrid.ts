import type { YearCell } from './types';

export interface GenerateYearGridOptions {
  /** The year to center the decade around. */
  currentYear: number;
  minDate?: Date;
  maxDate?: Date;
  /** The currently selected/viewing year. Used to highlight the active year. */
  selectedYear?: number;
}

/**
 * Pure, stateless function to generate a 12-cell year grid (decade view).
 * Shows the decade containing `currentYear` — e.g., 2020–2031 for year 2026.
 */
export function generateYearGrid({
  currentYear,
  minDate,
  maxDate,
  selectedYear
}: GenerateYearGridOptions): YearCell[] {
  const today = new Date();
  const thisYear = today.getFullYear();

  // Calculate decade start: floor to nearest 10
  const decadeStart = Math.floor(currentYear / 10) * 10;

  const cells: YearCell[] = [];

  for (let i = 0; i < 12; i++) {
    const year = decadeStart + i;

    let isDisabled = false;

    if (minDate && year < minDate.getFullYear()) {
      isDisabled = true;
    }
    if (maxDate && year > maxDate.getFullYear()) {
      isDisabled = true;
    }

    cells.push({
      year,
      isCurrentYear: year === thisYear,
      isSelected: selectedYear !== undefined && year === selectedYear,
      isDisabled
    });
  }

  return cells;
}

/**
 * Returns the decade label string for display in the header.
 * @example getDecadeLabel(2026) → '2020 – 2031'
 */
export function getDecadeLabel(currentYear: number): string {
  const decadeStart = Math.floor(currentYear / 10) * 10;
  return `${decadeStart} – ${decadeStart + 11}`;
}
