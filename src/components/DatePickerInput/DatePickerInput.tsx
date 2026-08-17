import React, { useCallback, useRef, useMemo, useState } from 'react';
import type { UseCalendarConfig, UseSingleCalendarConfig, UseRangeCalendarConfig, UseMultipleCalendarConfig } from '../../hooks/useCalendar';
import { useDatePickerPopover } from '../../hooks/useDatePickerPopover';
import { useClickOutside } from '../../a11y/click-outside';
import { CalendarRoot } from '../Calendar/CalendarRoot';
import { formatDate } from '../../utils/formatDate';
import type { ReapexLocale } from '../../engine/locale';

export interface DatePickerInputProps<T extends UseCalendarConfig> {
  config: T;
  /** Display format string. Default: 'MM/DD/YYYY' */
  format?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Show clear (×) button when value exists */
  allowClear?: boolean;
  /** Disable the input */
  disabled?: boolean;
  /** Make the input read-only (click still opens calendar) */
  readOnly?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Locale configuration — auto-derives format, weekStartsOn, and day names. */
  locale?: ReapexLocale;
  /** Callback when popover opens/closes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Optional custom month/year formatter */
  formatMonthYear?: (month: number, year: number) => string;
  /** Optional custom day cell formatter */
  formatDay?: (date: Date) => string;
  /** Optional custom day name labels */
  dayNames?: readonly string[];
  /** Optional class names for styling */
  classNames?: {
    wrapper?: string;
    input?: string;
    clearButton?: string;
    popover?: string;
    calendar?: string;
    header?: string;
    grid?: string;
    monthGrid?: string;
    yearGrid?: string;
  };
}

/**
 * Complete DatePicker component with text input, popover calendar,
 * clear button, and click-outside dismiss.
 */
export function DatePickerInput<T extends UseCalendarConfig>({
  config,
  format: formatProp,
  placeholder = 'Select date...',
  allowClear = true,
  disabled = false,
  readOnly = true,
  weekStartsOn,
  locale,
  onOpenChange,
  formatMonthYear,
  formatDay,
  dayNames,
  classNames
}: DatePickerInputProps<T>) {
  const displayFormat = formatProp ?? locale?.formats.date ?? 'MM/DD/YYYY';
  const popover = useDatePickerPopover();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync onOpenChange callback
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

  // Format the display value based on mode
  const displayValue = useMemo(() => {
    const c = config as UseCalendarConfig;
    if (c.mode === 'single') {
      const val = (c as UseSingleCalendarConfig).value;
      return val ? formatDate(val, displayFormat) : '';
    }
    if (c.mode === 'range') {
      const [start, end] = (c as UseRangeCalendarConfig).value;
      const parts: string[] = [];
      if (start) parts.push(formatDate(start, displayFormat));
      if (end) parts.push(formatDate(end, displayFormat));
      return parts.join(' → ');
    }
    if (c.mode === 'multiple') {
      const vals = (c as UseMultipleCalendarConfig).value;
      if (vals.length === 0) return '';
      if (vals.length === 1 && vals[0]) return formatDate(vals[0], displayFormat);
      return `${vals.length} dates selected`;
    }
    return '';
  }, [config, displayFormat]);

  // Has value check for clear button
  const hasValue = useMemo(() => {
    const c = config as UseCalendarConfig;
    if (c.mode === 'single') return (c as UseSingleCalendarConfig).value !== null;
    if (c.mode === 'range') {
      const [s, e] = (c as UseRangeCalendarConfig).value;
      return s !== null || e !== null;
    }
    if (c.mode === 'multiple') return (c as UseMultipleCalendarConfig).value.length > 0;
    return false;
  }, [config]);

  // Clear handler
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const c = config as UseCalendarConfig;
    if (c.mode === 'single') {
      (c as UseSingleCalendarConfig & { onChange: (v: Date | null) => void }).onChange(null);
    } else if (c.mode === 'range') {
      (c as UseRangeCalendarConfig & { onChange: (v: [Date | null, Date | null]) => void }).onChange([null, null]);
    } else if (c.mode === 'multiple') {
      (c as UseMultipleCalendarConfig & { onChange: (v: Date[]) => void }).onChange([]);
    }
  }, [config]);

  // Auto-close on single selection
  const wrappedConfig = useMemo(() => {
    const c = config as UseCalendarConfig;
    if (c.mode === 'single') {
      const original = c as UseSingleCalendarConfig & { onChange: (v: Date | null) => void };
      return {
        ...original,
        onChange: (date: Date | null) => {
          original.onChange(date);
          handleClose();
        }
      } as T;
    }
    if (c.mode === 'range') {
      const original = c as UseRangeCalendarConfig & { onChange: (v: [Date | null, Date | null]) => void };
      return {
        ...original,
        onChange: (range: [Date | null, Date | null]) => {
          original.onChange(range);
          // Close only when both dates are selected
          if (range[0] && range[1]) {
            handleClose();
          }
        }
      } as T;
    }
    return config;
  }, [config, handleClose]);

  return (
    <div
      ref={wrapperRef}
      className={classNames?.wrapper}
      data-datepicker-wrapper=""
      data-mode={config.mode}
      data-open={popover.isOpen || undefined}
      data-disabled={disabled || undefined}
    >
      {/* Input trigger */}
      <div
        ref={popover.referenceRef}
        onClick={handleToggle}
        className={classNames?.input}
        data-datepicker-input=""
        role="combobox"
        aria-expanded={popover.isOpen}
        aria-haspopup="dialog"
        aria-label="Date picker"
        tabIndex={disabled ? -1 : 0}
      >
        <span data-datepicker-icon="">
          📅
        </span>

        <input
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          tabIndex={-1}
          data-datepicker-display=""
          aria-hidden="true"
        />

        {allowClear && hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={classNames?.clearButton}
            data-datepicker-clear=""
            aria-label="Clear date"
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
          data-datepicker-popover=""
          role="dialog"
          aria-modal="true"
          aria-label="Calendar"
        >
          <CalendarRoot
            config={wrappedConfig}
            weekStartsOn={weekStartsOn}
            locale={locale}
            trapFocus={true}
            formatMonthYear={formatMonthYear}
            formatDay={formatDay}
            dayNames={dayNames}
            classNames={{
              root: classNames?.calendar,
              header: classNames?.header,
              grid: classNames?.grid,
              monthGrid: classNames?.monthGrid,
              yearGrid: classNames?.yearGrid
            }}
          />
        </div>
      )}
    </div>
  );
}

DatePickerInput.displayName = 'DatePickerInput';
