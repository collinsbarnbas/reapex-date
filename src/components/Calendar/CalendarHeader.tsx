import React, { useCallback, useMemo } from 'react';
import type { CalendarView } from '../../engine/types';
import type { ReapexLocale } from '../../engine/locale';
import { getDecadeLabel } from '../../engine/yearGrid';

export interface CalendarHeaderProps {
  viewDate: Date;
  activeView: CalendarView;
  navigateNextMonth: () => void;
  navigatePrevMonth: () => void;
  navigateNextYear: () => void;
  navigatePrevYear: () => void;
  onTitleClick: () => void;
  /** Locale config for month names and navigation labels */
  locale?: ReapexLocale;
  /** Optional custom month/year formatter. Receives (month: number, year: number). */
  formatMonthYear?: (month: number, year: number) => string;
  className?: string;
}

const DEFAULT_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

/**
 * Presentational header with localized display and navigation controls.
 * Title is clickable — cycles through day → month → year views.
 * Navigation arrows change context based on active view.
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  viewDate,
  activeView,
  navigateNextMonth,
  navigatePrevMonth,
  navigateNextYear,
  navigatePrevYear,
  onTitleClick,
  locale,
  formatMonthYear,
  className
}) => {
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const monthNames = locale?.monthNames ?? DEFAULT_MONTH_NAMES;

  const displayLabel = useMemo(() => {
    if (activeView === 'year') {
      return getDecadeLabel(year);
    }
    if (activeView === 'month') {
      return String(year);
    }
    if (formatMonthYear) {
      return formatMonthYear(month, year);
    }
    return `${monthNames[month]} ${year}`;
  }, [month, year, activeView, formatMonthYear, monthNames]);

  const handlePrev = useCallback(() => {
    if (activeView === 'day') navigatePrevMonth();
    else navigatePrevYear();
  }, [activeView, navigatePrevMonth, navigatePrevYear]);

  const handleNext = useCallback(() => {
    if (activeView === 'day') navigateNextMonth();
    else navigateNextYear();
  }, [activeView, navigateNextMonth, navigateNextYear]);

  const navLabels = locale?.navigation;
  const prevLabel = activeView === 'day'
    ? (navLabels?.prevMonth ?? `Go to previous month`)
    : (navLabels?.prevYear ?? `Go to previous year`);
  const nextLabel = activeView === 'day'
    ? (navLabels?.nextMonth ?? `Go to next month`)
    : (navLabels?.nextYear ?? `Go to next year`);

  return (
    <div
      className={className}
      data-calendar-header=""
      data-view={activeView}
      role="presentation"
    >
      <button
        type="button"
        onClick={handlePrev}
        aria-label={prevLabel}
        data-nav="prev"
      >
        {'‹'}
      </button>

      <button
        type="button"
        onClick={onTitleClick}
        data-calendar-title=""
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Switch view, currently showing ${displayLabel}`}
      >
        {displayLabel}
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label={nextLabel}
        data-nav="next"
      >
        {'›'}
      </button>
    </div>
  );
};

CalendarHeader.displayName = 'CalendarHeader';
