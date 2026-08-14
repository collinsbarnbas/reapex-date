import React, { useCallback } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export interface CalendarHeaderProps {
  viewDate: Date;
  navigateNextMonth: () => void;
  navigatePrevMonth: () => void;
  navigateNextYear: () => void;
  navigatePrevYear: () => void;
  /** Optional custom month/year formatter. Receives (month: number, year: number). */
  formatMonthYear?: (month: number, year: number) => string;
  className?: string;
}

/**
 * Presentational shell displaying localized month/year names and navigation controls.
 * Pure markup — no hardcoded styles. Style via data attributes or className.
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewDate,
  navigateNextMonth,
  navigatePrevMonth,
  navigateNextYear,
  navigatePrevYear,
  formatMonthYear,
  className
}) => {
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const displayLabel = useCallback(() => {
    if (formatMonthYear) {
      return formatMonthYear(month, year);
    }
    return `${MONTH_NAMES[month]} ${year}`;
  }, [month, year, formatMonthYear]);

  return (
    <div
      className={className}
      data-calendar-header=""
      role="presentation"
    >
      <button
        type="button"
        onClick={navigatePrevYear}
        aria-label={`Go to previous year, ${year - 1}`}
        data-nav="prev-year"
      >
        {'«'}
      </button>

      <button
        type="button"
        onClick={navigatePrevMonth}
        aria-label={`Go to previous month, ${MONTH_NAMES[(month - 1 + 12) % 12]}`}
        data-nav="prev-month"
      >
        {'‹'}
      </button>

      <span
        data-calendar-title=""
        aria-live="polite"
        aria-atomic="true"
      >
        {displayLabel()}
      </span>

      <button
        type="button"
        onClick={navigateNextMonth}
        aria-label={`Go to next month, ${MONTH_NAMES[(month + 1) % 12]}`}
        data-nav="next-month"
      >
        {'›'}
      </button>

      <button
        type="button"
        onClick={navigateNextYear}
        aria-label={`Go to next year, ${year + 1}`}
        data-nav="next-year"
      >
        {'»'}
      </button>
    </div>
  );
};

CalendarHeader.displayName = 'CalendarHeader';
