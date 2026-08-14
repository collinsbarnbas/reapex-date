import React, { useCallback, useRef } from 'react';
import { useCalendar, UseCalendarConfig } from '../../hooks/useCalendar';
import { handleCalendarKeyDown } from '../../a11y/keyboard';
import { useFocusTrap } from '../../a11y/focus-trap';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

export interface CalendarRootProps<T extends UseCalendarConfig> {
  config: T;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** When true, focus is trapped inside the calendar (for modal/popover usage). */
  trapFocus?: boolean;
  /** Optional custom month/year formatter. */
  formatMonthYear?: (month: number, year: number) => string;
  /** Optional custom day cell formatter. */
  formatDay?: (date: Date) => string;
  /** Optional custom day name labels. Must be exactly 7 items. */
  dayNames?: readonly string[];
  /** Optional class names for styling sections. */
  classNames?: {
    root?: string;
    header?: string;
    grid?: string;
  };
}

/**
 * Master orchestrator component linking the stateful useCalendar hook,
 * framework-agnostic keyboard router, and modal focus trapping.
 *
 * Renders unstyled semantic HTML — style via data attributes, className, or CSS utilities.
 */
export function CalendarRoot<T extends UseCalendarConfig>({
  config,
  weekStartsOn = 0,
  trapFocus = false,
  formatMonthYear,
  formatDay,
  dayNames,
  classNames
}: CalendarRootProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const calendar = useCalendar({ config, weekStartsOn });

  // Activate focus trap for modal/popover usage
  useFocusTrap(containerRef, trapFocus);

  // Bridge React synthetic keyboard events to the native KeyboardEvent router
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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

  // Hover handler for range mode preview
  const handleDayMouseEnter = useCallback((date: Date) => {
    calendar.setHoverDate(date);
  }, [calendar.setHoverDate]);

  const handleDayMouseLeave = useCallback(() => {
    calendar.setHoverDate(null);
  }, [calendar.setHoverDate]);

  return (
    <div
      ref={containerRef}
      className={classNames?.root}
      data-calendar-root=""
      data-mode={config.mode}
      role="application"
      aria-roledescription="datepicker"
    >
      <CalendarHeader
        viewDate={calendar.viewDate}
        navigateNextMonth={calendar.navigateNextMonth}
        navigatePrevMonth={calendar.navigatePrevMonth}
        navigateNextYear={calendar.navigateNextYear}
        navigatePrevYear={calendar.navigatePrevYear}
        formatMonthYear={formatMonthYear}
        className={classNames?.header}
      />

      <CalendarGrid
        calendarDays={calendar.calendarDays}
        weekStartsOn={weekStartsOn}
        onDayClick={calendar.selectDate}
        onDayMouseEnter={handleDayMouseEnter}
        onDayMouseLeave={handleDayMouseLeave}
        onKeyDown={handleKeyDown}
        formatDay={formatDay}
        dayNames={dayNames}
        className={classNames?.grid}
      />
    </div>
  );
}

CalendarRoot.displayName = 'CalendarRoot';
