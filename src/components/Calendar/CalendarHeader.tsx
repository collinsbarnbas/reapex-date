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
 * Day view shows 4 buttons: « (prev year) ‹ (prev month) Title › (next month) » (next year).
 * Month/Year views show 2 buttons: ‹ (prev year/decade) Title › (next year/decade).
 * Title is clickable — cycles through day → month → year views.
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

  // In month/year views, ‹/› jump years (or decades). In day view, ‹/› jump months.
  const handlePrev = useCallback(() => {
    if (activeView === 'day') navigatePrevMonth();
    else navigatePrevYear();
  }, [activeView, navigatePrevMonth, navigatePrevYear]);

  const handleNext = useCallback(() => {
    if (activeView === 'day') navigateNextMonth();
    else navigateNextYear();
  }, [activeView, navigateNextMonth, navigateNextYear]);

  const navLabels = locale?.navigation;
  const prevMonthLabel = navLabels?.prevMonth ?? 'Go to previous month';
  const nextMonthLabel = navLabels?.nextMonth ?? 'Go to next month';
  const prevYearLabel = navLabels?.prevYear ?? 'Go to previous year';
  const nextYearLabel = navLabels?.nextYear ?? 'Go to next year';

  return (
    <div
      className={className}
      data-calendar-header=""
      data-view={activeView}
      role="presentation"
    >
      {/* « prev year — visible in day view only */}
      {activeView === 'day' && (
        <button
          type="button"
          onClick={navigatePrevYear}
          aria-label={prevYearLabel}
          data-nav="prev-year"
        >
          {'«'}
        </button>
      )}

      {/* ‹ prev month (day view) or prev year/decade (month/year view) */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label={activeView === 'day' ? prevMonthLabel : prevYearLabel}
        data-nav="prev"
      >
        {'‹'}
      </button>

      {/* Clickable title */}
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

      {/* › next month (day view) or next year/decade (month/year view) */}
      <button
        type="button"
        onClick={handleNext}
        aria-label={activeView === 'day' ? nextMonthLabel : nextYearLabel}
        data-nav="next"
      >
        {'›'}
      </button>

      {/* » next year — visible in day view only */}
      {activeView === 'day' && (
        <button
          type="button"
          onClick={navigateNextYear}
          aria-label={nextYearLabel}
          data-nav="next-year"
        >
          {'»'}
        </button>
      )}
    </div>
  );
};

CalendarHeader.displayName = 'CalendarHeader';
