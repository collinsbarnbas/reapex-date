import React, { useState, useCallback, useMemo } from 'react';
import type { UseSingleCalendarConfig } from '../../hooks/useCalendar';
import type { TimeValue } from '../../engine/timeGrid';
import type { ReapexLocale } from '../../engine/locale';
import { CalendarRoot } from '../Calendar/CalendarRoot';
import { TimePicker } from '../TimePicker/TimePicker';

export interface DateTimePickerProps {
  /** Selected date (with time embedded) */
  value: Date | null;
  /** Called when date or time changes */
  onChange: (date: Date | null) => void;
  /** Min selectable date */
  minDate?: Date;
  /** Max selectable date */
  maxDate?: Date;
  /** Dates that cannot be selected */
  disabledDates?: Date[];
  /** Custom disable function */
  shouldDisableDate?: (date: Date) => boolean;
  /** Use 12-hour format for time */
  use12Hour?: boolean;
  /** Show seconds column (default: false) */
  showSeconds?: boolean;
  /** Minute step interval (default: 1) */
  minuteStep?: number;
  /** Second step interval (default: 1) */
  secondStep?: number;
  /** Disabled hours (0-23) */
  disabledHours?: number[];
  /** Disabled minutes (0-59) */
  disabledMinutes?: number[];
  /** Disabled seconds (0-59) */
  disabledSeconds?: number[];
  /** Locale configuration */
  locale?: ReapexLocale;
  /** Class names for styling */
  classNames?: {
    root?: string;
    calendar?: string;
    header?: string;
    grid?: string;
    monthGrid?: string;
    yearGrid?: string;
    timePicker?: string;
    timeColumn?: string;
    timeCell?: string;
    footer?: string;
  };
}

/**
 * Combined Date + Time picker component.
 * Shows a calendar grid alongside a time picker column.
 * The selected Date object carries both date and time information.
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  shouldDisableDate,
  use12Hour = false,
  showSeconds = false,
  minuteStep = 1,
  secondStep = 1,
  disabledHours = [],
  disabledMinutes = [],
  disabledSeconds = [],
  locale,
  classNames
}) => {
  // Extract time from current value
  const currentTime = useMemo<TimeValue>(() => {
    if (!value) return { hour: 0, minute: 0, second: 0 };
    return {
      hour: value.getHours(),
      minute: value.getMinutes(),
      second: value.getSeconds()
    };
  }, [value]);

  // Handle date selection from calendar
  const handleDateChange = useCallback((date: Date | null) => {
    if (!date) {
      onChange(null);
      return;
    }
    // Preserve existing time when changing date
    const combined = new Date(date);
    combined.setHours(currentTime.hour, currentTime.minute, currentTime.second, 0);
    onChange(combined);
  }, [onChange, currentTime]);

  // Handle time change from time picker
  const handleTimeChange = useCallback((time: TimeValue) => {
    const base = value ?? new Date();
    const combined = new Date(base);
    combined.setHours(time.hour, time.minute, time.second, 0);
    onChange(combined);
  }, [value, onChange]);

  // Calendar config
  const calendarConfig: UseSingleCalendarConfig = useMemo(() => ({
    mode: 'single' as const,
    value,
    onChange: handleDateChange,
    minDate,
    maxDate,
    disabledDates,
    shouldDisableDate
  }), [value, handleDateChange, minDate, maxDate, disabledDates, shouldDisableDate]);

  // Format display string
  const displayString = useMemo(() => {
    if (!value) return '';
    const dateStr = value.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
    const h = String(value.getHours()).padStart(2, '0');
    const m = String(value.getMinutes()).padStart(2, '0');
    const s = String(value.getSeconds()).padStart(2, '0');
    const timePart = showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
    return `${dateStr} ${timePart}`;
  }, [value]);

  return (
    <div
      className={classNames?.root}
      data-datetime-picker=""
      data-has-value={value ? 'true' : undefined}
      role="group"
      aria-label="Date and time picker"
    >
      <div data-datetime-calendar="">
        <CalendarRoot
          config={calendarConfig}
          locale={locale}
          classNames={{
            root: classNames?.calendar,
            header: classNames?.header,
            grid: classNames?.grid,
            monthGrid: classNames?.monthGrid,
            yearGrid: classNames?.yearGrid,
            footer: classNames?.footer
          }}
        />
      </div>

      <div data-datetime-time="">
        <TimePicker
          value={currentTime}
          onChange={handleTimeChange}
          use12Hour={use12Hour}
          showSeconds={showSeconds}
          minuteStep={minuteStep}
          secondStep={secondStep}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          classNames={{
            root: classNames?.timePicker,
            column: classNames?.timeColumn,
            cell: classNames?.timeCell
          }}
        />
      </div>

      {displayString && (
        <div data-datetime-display="" aria-live="polite">
          {displayString}
        </div>
      )}
    </div>
  );
};

DateTimePicker.displayName = 'DateTimePicker';
