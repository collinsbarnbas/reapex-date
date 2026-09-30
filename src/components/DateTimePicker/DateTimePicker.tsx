import React, { useState, useCallback, useMemo } from 'react';
import type { UseSingleCalendarConfig } from '../../hooks/useCalendar';
import type { TimeValue } from '../../engine/timeGrid';
import type { ReapexLocale } from '../../engine/locale';
import { CalendarRoot } from '../Calendar/CalendarRoot';
import { TimePicker } from '../TimePicker/TimePicker';

export type DateTimeView = 'date' | 'time';

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
  /** Text for the "Select Time" toggle (default: 'Select Time') */
  selectTimeText?: string;
  /** Text for the "Select Date" toggle (default: 'Select Date') */
  selectDateText?: string;
  /** Text for "Clear" button (default: 'Clear') */
  clearText?: string;
  /** Text for "Now" button (default: 'Now') */
  nowText?: string;
  /** Text for "Confirm" button (default: 'Confirm') */
  confirmText?: string;
  /** Called when "Confirm" is clicked */
  onConfirm?: () => void;
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
 * Combined Date + Time picker with toggle views.
 * Date view: Calendar grid for date selection.
 * Time view: Scrollable hour/min/sec columns.
 * Footer: "Select Time/Date" toggle + Clear | Now | Confirm buttons.
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
  selectTimeText = 'Select Time',
  selectDateText = 'Select Date',
  clearText = 'Clear',
  nowText = 'Now',
  confirmText = 'Confirm',
  onConfirm,
  classNames
}) => {
  const [activeView, setActiveView] = useState<DateTimeView>('date');

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

  // Clear handler — resets value to null
  const handleClear = useCallback(() => {
    onChange(null);
  }, [onChange]);

  // Now handler — sets to current date and time
  const handleNow = useCallback(() => {
    onChange(new Date());
  }, [onChange]);

  // Confirm handler
  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  // Toggle between date and time views
  const toggleView = useCallback(() => {
    setActiveView(prev => prev === 'date' ? 'time' : 'date');
  }, []);

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

  return (
    <div
      className={classNames?.root}
      data-datetime-picker=""
      data-datetime-view={activeView}
      data-has-value={value ? 'true' : undefined}
      role="group"
      aria-label="Date and time picker"
    >
      {/* Date View — Calendar */}
      {activeView === 'date' && (
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
            }}
          />
        </div>
      )}

      {/* Time View — TimePicker */}
      {activeView === 'time' && (
        <div data-datetime-time="">
          <div data-datetime-time-title="" aria-hidden="true">{selectTimeText}</div>
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
      )}

      {/* Footer: Toggle + Action Buttons */}
      <div className={classNames?.footer} data-datetime-footer="">
        <button
          type="button"
          onClick={toggleView}
          data-datetime-toggle=""
          aria-label={activeView === 'date' ? selectTimeText : selectDateText}
        >
          {activeView === 'date' ? selectTimeText : selectDateText}
        </button>

        <div data-datetime-actions="">
          <button
            type="button"
            onClick={handleClear}
            data-datetime-clear=""
          >
            {clearText}
          </button>
          <button
            type="button"
            onClick={handleNow}
            data-datetime-now=""
          >
            {nowText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            data-datetime-confirm=""
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

DateTimePicker.displayName = 'DateTimePicker';

