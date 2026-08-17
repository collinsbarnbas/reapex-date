import React, { useCallback, useRef, useEffect } from 'react';
import type { CalendarDay } from '../../engine/types';

const DEFAULT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export interface CalendarGridProps {
  calendarDays: CalendarDay[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  onDayClick: (date: Date) => void;
  onDayMouseEnter?: (date: Date) => void;
  onDayMouseLeave?: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Optional custom day name labels. Must be exactly 7 items. */
  dayNames?: readonly string[];
  /** Optional custom day cell formatter. */
  formatDay?: (date: Date) => string;
  /** Custom day cell renderer. Receives the CalendarDay data and default label. */
  renderDay?: (day: CalendarDay, defaultLabel: string) => React.ReactNode;
  className?: string;
}

/**
 * Formats day headers and maps the 42-day cell grid using semantic <table> markup.
 * Exposes data attributes for styling freedom. Zero hardcoded CSS.
 */
export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  weekStartsOn = 0,
  onDayClick,
  onDayMouseEnter,
  onDayMouseLeave,
  onKeyDown,
  dayNames,
  formatDay,
  renderDay,
  className
}) => {
  const gridRef = useRef<HTMLTableElement>(null);

  // Build ordered day name headers based on weekStartsOn
  const orderedDayNames = React.useMemo(() => {
    const names = dayNames ?? DEFAULT_DAY_NAMES;
    const ordered: string[] = [];
    for (let i = 0; i < 7; i++) {
      const index = (weekStartsOn + i) % 7;
      const name = names[index];
      if (name !== undefined) {
        ordered.push(name);
      }
    }
    return ordered;
  }, [weekStartsOn, dayNames]);

  // Chunk the flat 42-day array into 6 rows of 7
  const weeks = React.useMemo(() => {
    const rows: CalendarDay[][] = [];
    for (let i = 0; i < 42; i += 7) {
      rows.push(calendarDays.slice(i, i + 7));
    }
    return rows;
  }, [calendarDays]);

  // Auto-focus the focused cell when it changes
  useEffect(() => {
    if (!gridRef.current) return;
    const focusedCell = gridRef.current.querySelector<HTMLButtonElement>('[data-focused="true"]');
    if (focusedCell && document.activeElement !== focusedCell) {
      focusedCell.focus();
    }
  }, [calendarDays]);

  const handleDayClick = useCallback((day: CalendarDay) => {
    if (day.isDisabled) return;
    onDayClick(day.date);
  }, [onDayClick]);

  const handleDayMouseEnter = useCallback((day: CalendarDay) => {
    if (day.isDisabled) return;
    onDayMouseEnter?.(day.date);
  }, [onDayMouseEnter]);

  const getDayLabel = useCallback((date: Date): string => {
    if (formatDay) return formatDay(date);
    return date.getDate().toString();
  }, [formatDay]);

  return (
    <table
      ref={gridRef}
      className={className}
      role="grid"
      aria-label="Calendar"
      onKeyDown={onKeyDown}
      data-calendar-grid=""
    >
      <thead role="rowgroup">
        <tr role="row">
          {orderedDayNames.map((name, i) => (
            <th
              key={i}
              role="columnheader"
              scope="col"
              aria-label={name}
              data-day-header=""
            >
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {weeks.map((week, weekIdx) => (
          <tr key={weekIdx} role="row">
            {week.map((day, dayIdx) => (
              <td
                key={dayIdx}
                role="gridcell"
                aria-selected={day.isSelected}
                aria-disabled={day.isDisabled}
              >
                <button
                  type="button"
                  tabIndex={day.isFocused ? 0 : -1}
                  disabled={day.isDisabled}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => handleDayMouseEnter(day)}
                  onMouseLeave={onDayMouseLeave}
                  data-date={day.date.toISOString().split('T')[0]}
                  data-today={day.isToday || undefined}
                  data-selected={day.isSelected || undefined}
                  data-disabled={day.isDisabled || undefined}
                  data-in-range={day.isInRange || undefined}
                  data-range-start={day.isRangeStart || undefined}
                  data-range-end={day.isRangeEnd || undefined}
                  data-hover-range={day.isHovered || undefined}
                  data-focused={day.isFocused || undefined}
                  data-outside-month={!day.isCurrentMonth || undefined}
                  aria-label={day.date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                >
                  {renderDay ? renderDay(day, getDayLabel(day.date)) : getDayLabel(day.date)}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

CalendarGrid.displayName = 'CalendarGrid';
