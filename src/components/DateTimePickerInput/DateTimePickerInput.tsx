import React, { useCallback, useRef, useMemo } from 'react';
import { useDatePickerPopover } from '../../hooks/useDatePickerPopover';
import { useClickOutside } from '../../a11y/click-outside';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../engine/timeGrid';
import type { TimeValue } from '../../engine/timeGrid';
import type { ReapexLocale } from '../../engine/locale';
import { DateTimePicker } from '../DateTimePicker/DateTimePicker';

export interface DateTimePickerInputProps {
  /** Selected date+time value (controlled) */
  value: Date | null;
  /** Called when date or time changes */
  onChange: (date: Date | null) => void;
  /** Date display format (default: 'MM/DD/YYYY') */
  dateFormat?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Show clear (×) button when value exists */
  allowClear?: boolean;
  /** Disable the input */
  disabled?: boolean;
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
  /** Week start day (0=Sun, 1=Mon) */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Locale configuration */
  locale?: ReapexLocale;
  /** Callback when popover opens/closes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Text for "Select Time" toggle (default: 'Select Time') */
  selectTimeText?: string;
  /** Text for "Select Date" toggle (default: 'Select Date') */
  selectDateText?: string;
  /** Text for "Clear" button (default: 'Clear') */
  clearText?: string;
  /** Text for "Now" button (default: 'Now') */
  nowText?: string;
  /** Text for "Confirm" button (default: 'Confirm') */
  confirmText?: string;
  /** Optional class names for styling */
  classNames?: {
    wrapper?: string;
    input?: string;
    clearButton?: string;
    popover?: string;
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
 * Complete DateTime picker with text input + floating popover.
 * Shows date and time in the input field, opens a combined calendar + time picker on click.
 * Popover contains the DateTimePicker with built-in Clear/Now/Confirm buttons.
 */
export const DateTimePickerInput: React.FC<DateTimePickerInputProps> = ({
  value,
  onChange,
  dateFormat: dateFormatProp,
  placeholder = 'Select date & time...',
  allowClear = true,
  disabled = false,
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
  weekStartsOn,
  locale,
  onOpenChange,
  selectTimeText,
  selectDateText,
  clearText,
  nowText,
  confirmText,
  classNames
}) => {
  const dateFormat = dateFormatProp ?? locale?.formats.date ?? 'MM/DD/YYYY';
  const popover = useDatePickerPopover();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Open/close handlers
  const handleOpen = useCallback(() => {
    if (disabled) return;
    popover.open();
    onOpenChange?.(true);
  }, [disabled, popover.open, onOpenChange]);

  const handleClose = useCallback(() => {
    popover.close();
    onOpenChange?.(false);
  }, [popover.close, onOpenChange]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    if (popover.isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [disabled, popover.isOpen, handleClose, handleOpen]);

  // Click-outside to dismiss
  useClickOutside(wrapperRef, popover.isOpen, handleClose);

  // Format the display value: "Aug 17, 2026 14:30" or "Aug 17, 2026 02:30:45 PM"
  const displayValue = useMemo(() => {
    if (!value) return '';
    const datePart = formatDate(value, dateFormat);
    const timeVal: TimeValue = {
      hour: value.getHours(),
      minute: value.getMinutes(),
      second: value.getSeconds()
    };
    const timePart = formatTime(timeVal, use12Hour, showSeconds);
    return `${datePart} ${timePart}`;
  }, [value, dateFormat, use12Hour, showSeconds]);

  // Clear handler
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  }, [onChange]);

  return (
    <div
      ref={wrapperRef}
      className={classNames?.wrapper}
      data-datetimepicker-wrapper=""
      data-open={popover.isOpen || undefined}
      data-disabled={disabled || undefined}
      data-has-value={value ? 'true' : undefined}
    >
      {/* Input trigger */}
      <div
        ref={popover.referenceRef}
        onClick={handleToggle}
        className={classNames?.input}
        data-datetimepicker-input=""
        role="combobox"
        aria-expanded={popover.isOpen}
        aria-haspopup="dialog"
        aria-label="Date and time picker"
        tabIndex={disabled ? -1 : 0}
      >
        <span data-datetimepicker-icon="">📅</span>

        <input
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          tabIndex={-1}
          data-datetimepicker-display=""
          aria-hidden="true"
        />

        {allowClear && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={classNames?.clearButton}
            data-datetimepicker-clear=""
            aria-label="Clear date and time"
            tabIndex={-1}
          >
            ×
          </button>
        )}
      </div>

      {/* Floating popover */}
      {popover.isOpen && (
        <div
          ref={popover.floatingRef}
          style={popover.floatingStyles}
          className={classNames?.popover}
          data-datetimepicker-popover=""
          role="dialog"
          aria-modal="true"
          aria-label="Date and time selector"
        >
          <DateTimePicker
            value={value}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            disabledDates={disabledDates}
            shouldDisableDate={shouldDisableDate}
            use12Hour={use12Hour}
            showSeconds={showSeconds}
            minuteStep={minuteStep}
            secondStep={secondStep}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            locale={locale}
            selectTimeText={selectTimeText}
            selectDateText={selectDateText}
            clearText={clearText}
            nowText={nowText}
            confirmText={confirmText}
            onConfirm={handleClose}
            classNames={{
              root: classNames?.root,
              calendar: classNames?.calendar,
              header: classNames?.header,
              grid: classNames?.grid,
              monthGrid: classNames?.monthGrid,
              yearGrid: classNames?.yearGrid,
              timePicker: classNames?.timePicker,
              timeColumn: classNames?.timeColumn,
              timeCell: classNames?.timeCell,
              footer: classNames?.footer
            }}
          />
        </div>
      )}
    </div>
  );
};

DateTimePickerInput.displayName = 'DateTimePickerInput';

