import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { useTimePicker } from '../../hooks/useTimePicker';
import { generateHourGrid, generateMinuteGrid, generateSecondGrid, to24Hour } from '../../engine/timeGrid';
import type { TimeValue, HourCell, MinuteCell, SecondCell } from '../../engine/timeGrid';

export interface TimePickerProps {
  /** Current time value (controlled) */
  value?: TimeValue;
  /** Called when time changes */
  onChange?: (time: TimeValue) => void;
  /** Use 12-hour format with AM/PM toggle */
  use12Hour?: boolean;
  /** Show seconds column (default: false) */
  showSeconds?: boolean;
  /** Minute step interval (default: 1) */
  minuteStep?: number;
  /** Second step interval (default: 1) */
  secondStep?: number;
  /** Hours that cannot be selected (0-23) */
  disabledHours?: number[];
  /** Minutes that cannot be selected (0-59) */
  disabledMinutes?: number[];
  /** Seconds that cannot be selected (0-59) */
  disabledSeconds?: number[];
  /** Optional class names */
  classNames?: {
    root?: string;
    column?: string;
    cell?: string;
    meridiem?: string;
  };
}

/**
 * Scrollable column-based time picker component.
 * Exposes data attributes for complete styling freedom.
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  use12Hour = false,
  showSeconds = false,
  minuteStep = 1,
  secondStep = 1,
  disabledHours = [],
  disabledMinutes = [],
  disabledSeconds = [],
  classNames
}) => {
  const timer = useTimePicker({ value, onChange, use12Hour, minuteStep, disabledHours, disabledMinutes });

  const hours = useMemo(() =>
    generateHourGrid({ selectedHour: timer.hour, use12Hour, disabledHours }),
    [timer.hour, use12Hour, disabledHours]
  );

  const minutes = useMemo(() =>
    generateMinuteGrid({ selectedMinute: timer.minute, minuteStep, disabledMinutes }),
    [timer.minute, minuteStep, disabledMinutes]
  );

  const seconds = useMemo(() =>
    showSeconds
      ? generateSecondGrid({ selectedSecond: timer.second, secondStep, disabledSeconds })
      : [],
    [timer.second, secondStep, disabledSeconds, showSeconds]
  );

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  // Auto-scroll selected into view
  useEffect(() => {
    const scrollToSelected = (container: HTMLDivElement | null) => {
      if (!container) return;
      const selected = container.querySelector('[data-selected="true"]') as HTMLElement | null;
      if (selected) {
        selected.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    };
    scrollToSelected(hourRef.current);
    scrollToSelected(minuteRef.current);
    if (showSeconds) scrollToSelected(secondRef.current);
  }, [showSeconds]);

  const handleHourClick = useCallback((cell: HourCell) => {
    if (cell.isDisabled) return;
    if (use12Hour) {
      // Convert 12h selection back to 24h
      timer.setHour(to24Hour(cell.value === 0 ? 12 : cell.value, timer.meridiem));
    } else {
      timer.setHour(cell.value);
    }
  }, [timer.setHour, timer.meridiem, use12Hour]);

  const handleMinuteClick = useCallback((cell: MinuteCell) => {
    if (cell.isDisabled) return;
    timer.setMinute(cell.value);
  }, [timer.setMinute]);

  const handleSecondClick = useCallback((cell: SecondCell) => {
    if (cell.isDisabled) return;
    timer.setSecond(cell.value);
  }, [timer.setSecond]);

  return (
    <div
      className={classNames?.root}
      data-time-picker=""
      data-format={use12Hour ? '12h' : '24h'}
      data-show-seconds={showSeconds || undefined}
      role="group"
      aria-label="Time picker"
    >
      {/* Hour Column */}
      <div
        ref={hourRef}
        className={classNames?.column}
        data-time-column="hour"
        role="listbox"
        aria-label="Hours"
      >
        {hours.map((cell) => (
          <button
            key={cell.value}
            type="button"
            role="option"
            className={classNames?.cell}
            onClick={() => handleHourClick(cell)}
            disabled={cell.isDisabled}
            data-time-cell="hour"
            data-value={cell.value}
            data-selected={cell.isSelected || undefined}
            data-disabled={cell.isDisabled || undefined}
            aria-selected={cell.isSelected}
            aria-disabled={cell.isDisabled}
          >
            {cell.label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div data-time-separator="" aria-hidden="true">:</div>

      {/* Minute Column */}
      <div
        ref={minuteRef}
        className={classNames?.column}
        data-time-column="minute"
        role="listbox"
        aria-label="Minutes"
      >
        {minutes.map((cell) => (
          <button
            key={cell.value}
            type="button"
            role="option"
            className={classNames?.cell}
            onClick={() => handleMinuteClick(cell)}
            disabled={cell.isDisabled}
            data-time-cell="minute"
            data-value={cell.value}
            data-selected={cell.isSelected || undefined}
            data-disabled={cell.isDisabled || undefined}
            aria-selected={cell.isSelected}
            aria-disabled={cell.isDisabled}
          >
            {cell.label}
          </button>
        ))}
      </div>

      {/* Seconds Column (optional) */}
      {showSeconds && (
        <>
          <div data-time-separator="" aria-hidden="true">:</div>
          <div
            ref={secondRef}
            className={classNames?.column}
            data-time-column="second"
            role="listbox"
            aria-label="Seconds"
          >
            {seconds.map((cell) => (
              <button
                key={cell.value}
                type="button"
                role="option"
                className={classNames?.cell}
                onClick={() => handleSecondClick(cell)}
                disabled={cell.isDisabled}
                data-time-cell="second"
                data-value={cell.value}
                data-selected={cell.isSelected || undefined}
                data-disabled={cell.isDisabled || undefined}
                aria-selected={cell.isSelected}
                aria-disabled={cell.isDisabled}
              >
                {cell.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* AM/PM Toggle (12h mode only) */}
      {use12Hour && (
        <div
          className={classNames?.meridiem}
          data-time-column="meridiem"
          role="listbox"
          aria-label="AM/PM"
        >
          <button
            type="button"
            role="option"
            onClick={() => timer.setMeridiem('AM')}
            data-time-cell="meridiem"
            data-selected={timer.meridiem === 'AM' || undefined}
            aria-selected={timer.meridiem === 'AM'}
          >
            AM
          </button>
          <button
            type="button"
            role="option"
            onClick={() => timer.setMeridiem('PM')}
            data-time-cell="meridiem"
            data-selected={timer.meridiem === 'PM' || undefined}
            aria-selected={timer.meridiem === 'PM'}
          >
            PM
          </button>
        </div>
      )}
    </div>
  );
};

TimePicker.displayName = 'TimePicker';
