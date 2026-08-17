import React, { useCallback, useRef, useMemo } from 'react';
import { useCalendar, UseCalendarConfig } from '../../hooks/useCalendar';
import { useCalendarView } from '../../hooks/useCalendarView';
import { handleCalendarKeyDown } from '../../a11y/keyboard';
import { useFocusTrap } from '../../a11y/focus-trap';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import type { ReapexLocale } from '../../engine/locale';
import type { CalendarDay } from '../../engine/types';

export interface CalendarRootProps<T extends UseCalendarConfig> {
  config: T;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Locale configuration for month/day names, direction, and labels. */
  locale?: ReapexLocale;
  /** When true, focus is trapped inside the calendar (for modal/popover usage). */
  trapFocus?: boolean;
  /** Optional custom month/year formatter. */
  formatMonthYear?: (month: number, year: number) => string;
  /** Optional custom day cell formatter. */
  formatDay?: (date: Date) => string;
  /** Optional custom day name labels. Must be exactly 7 items. Overrides locale. */
  dayNames?: readonly string[];
  /** Custom day cell renderer. Receives the CalendarDay data and default label. */
  renderDay?: (day: CalendarDay, defaultLabel: string) => React.ReactNode;
  /** Custom footer content rendered below the calendar grid. */
  renderFooter?: () => React.ReactNode;
  /** Optional class names for styling sections. */
  classNames?: {
    root?: string;
    header?: string;
    grid?: string;
    monthGrid?: string;
    yearGrid?: string;
    footer?: string;
  };
}

/**
 * Master orchestrator component linking the stateful useCalendar hook,
 * view state machine (day/month/year), keyboard router, and focus trapping.
 */
export function CalendarRoot<T extends UseCalendarConfig>({
  config,
  weekStartsOn: weekStartsOnProp,
  locale,
  trapFocus = false,
  formatMonthYear,
  formatDay,
  dayNames: dayNamesProp,
  renderDay,
  renderFooter,
  classNames
}: CalendarRootProps<T>) {
  // Derive weekStartsOn from locale if not explicitly set
  const weekStartsOn = weekStartsOnProp ?? locale?.weekStartsOn ?? 0;
  // Derive day names from locale if not explicitly set
  const dayNames = dayNamesProp ?? locale?.dayNamesMin;
  const dir = locale?.dir ?? 'ltr';

  const containerRef = useRef<HTMLDivElement>(null);

  const calendar = useCalendar({ config, weekStartsOn });
  const viewState = useCalendarView('day');

  // Activate focus trap for modal/popover usage
  useFocusTrap(containerRef, trapFocus);

  // Bridge React synthetic keyboard events to the native KeyboardEvent router
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Keyboard navigation only applies in day view
    if (viewState.activeView !== 'day') return;

    handleCalendarKeyDown(e.nativeEvent, {
      focusedDate: calendar.calendarDays.find(d => d.isFocused)?.date ?? null,
      viewDate: calendar.viewDate,
      weekStartsOn,
      minDate: config.minDate,
      maxDate: config.maxDate,
      disabledDates: config.disabledDates,
      shouldDisableDate: config.shouldDisableDate,
      onFocusChange: calendar.setFocusedDate,
      onViewChange: calendar.setViewDate,
      onSelect: calendar.selectDate
    });
  }, [
    viewState.activeView,
    calendar.calendarDays,
    calendar.viewDate,
    calendar.setFocusedDate,
    calendar.setViewDate,
    calendar.selectDate,
    weekStartsOn,
    config.minDate,
    config.maxDate,
    config.disabledDates,
    config.shouldDisableDate
  ]);

  // Month selected from MonthView → update view date + switch to day view
  const handleMonthSelect = useCallback((month: number) => {
    const current = calendar.viewDate;
    const newDate = new Date(current.getFullYear(), month, 1);
    calendar.setViewDate(newDate);
    viewState.goToDayView();
  }, [calendar.viewDate, calendar.setViewDate, viewState.goToDayView]);

  // Year selected from YearView → update view date + switch to month view
  const handleYearSelect = useCallback((year: number) => {
    const current = calendar.viewDate;
    const newDate = new Date(year, current.getMonth(), 1);
    calendar.setViewDate(newDate);
    viewState.goToMonthView();
  }, [calendar.viewDate, calendar.setViewDate, viewState.goToMonthView]);

  // Hover handler for range mode preview
  const handleDayMouseEnter = useCallback((date: Date) => {
    calendar.setHoverDate(date);
  }, [calendar.setHoverDate]);

  const handleDayMouseLeave = useCallback(() => {
    calendar.setHoverDate(null);
  }, [calendar.setHoverDate]);

  // Year navigation for month/year views
  const navigatePrevDecade = useCallback(() => {
    const current = calendar.viewDate;
    calendar.setViewDate(new Date(current.getFullYear() - 10, current.getMonth(), 1));
  }, [calendar.viewDate, calendar.setViewDate]);

  const navigateNextDecade = useCallback(() => {
    const current = calendar.viewDate;
    calendar.setViewDate(new Date(current.getFullYear() + 10, current.getMonth(), 1));
  }, [calendar.viewDate, calendar.setViewDate]);

  // Navigation adapts to view: year view uses decade jumps
  const prevYearNav = viewState.activeView === 'year' ? navigatePrevDecade : calendar.navigatePrevYear;
  const nextYearNav = viewState.activeView === 'year' ? navigateNextDecade : calendar.navigateNextYear;

  return (
    <div
      ref={containerRef}
      className={classNames?.root}
      data-calendar-root=""
      data-mode={config.mode}
      data-view={viewState.activeView}
      dir={dir}
      role="application"
      aria-roledescription="datepicker"
    >
      <CalendarHeader
        viewDate={calendar.viewDate}
        activeView={viewState.activeView}
        navigateNextMonth={calendar.navigateNextMonth}
        navigatePrevMonth={calendar.navigatePrevMonth}
        navigateNextYear={nextYearNav}
        navigatePrevYear={prevYearNav}
        onTitleClick={viewState.cycleTitleView}
        locale={locale}
        formatMonthYear={formatMonthYear}
        className={classNames?.header}
      />

      {viewState.activeView === 'day' && (
        <CalendarGrid
          calendarDays={calendar.calendarDays}
          weekStartsOn={weekStartsOn}
          onDayClick={calendar.selectDate}
          onDayMouseEnter={handleDayMouseEnter}
          onDayMouseLeave={handleDayMouseLeave}
          onKeyDown={handleKeyDown}
          formatDay={formatDay}
          renderDay={renderDay}
          dayNames={dayNames}
          className={classNames?.grid}
        />
      )}

      {viewState.activeView === 'month' && (
        <MonthView
          viewYear={calendar.viewDate.getFullYear()}
          viewMonth={calendar.viewDate.getMonth()}
          minDate={config.minDate}
          maxDate={config.maxDate}
          onMonthSelect={handleMonthSelect}
          className={classNames?.monthGrid}
        />
      )}

      {viewState.activeView === 'year' && (
        <YearView
          viewYear={calendar.viewDate.getFullYear()}
          minDate={config.minDate}
          maxDate={config.maxDate}
          onYearSelect={handleYearSelect}
          className={classNames?.yearGrid}
        />
      )}

      {/* Custom footer */}
      {renderFooter && (
        <div className={classNames?.footer} data-calendar-footer="">
          {renderFooter()}
        </div>
      )}
    </div>
  );
}

CalendarRoot.displayName = 'CalendarRoot';
