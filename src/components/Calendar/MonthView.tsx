import React, { useMemo, useCallback } from 'react';
import type { MonthCell } from '../../engine/types';
import type { ReapexLocale } from '../../engine/locale';
import { generateMonthGrid } from '../../engine/monthGrid';

export interface MonthViewProps {
  viewYear: number;
  viewMonth: number;
  minDate?: Date;
  maxDate?: Date;
  onMonthSelect: (month: number) => void;
  /** Locale for localized month names */
  locale?: ReapexLocale;
  className?: string;
}

/**
 * 4×3 grid of month buttons for the month selector view.
 * Exposes data attributes for complete styling freedom.
 */
export const MonthView: React.FC<MonthViewProps> = ({
  viewYear,
  viewMonth,
  minDate,
  maxDate,
  onMonthSelect,
  locale,
  className
}) => {
  const months = useMemo(() =>
    generateMonthGrid({
      year: viewYear,
      minDate,
      maxDate,
      selectedMonth: viewMonth,
      monthLabels: locale?.monthNamesShort
    }),
    [viewYear, viewMonth, minDate, maxDate, locale]
  );

  const handleClick = useCallback((cell: MonthCell) => {
    if (cell.isDisabled) return;
    onMonthSelect(cell.month);
  }, [onMonthSelect]);

  // Chunk into 4 rows of 3
  const rows = useMemo(() => {
    const result: MonthCell[][] = [];
    for (let i = 0; i < 12; i += 3) {
      result.push(months.slice(i, i + 3));
    }
    return result;
  }, [months]);

  return (
    <table
      className={className}
      role="grid"
      aria-label="Month selector"
      data-month-grid=""
    >
      <tbody role="rowgroup">
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx} role="row">
            {row.map((cell) => (
              <td key={cell.month} role="gridcell">
                <button
                  type="button"
                  onClick={() => handleClick(cell)}
                  disabled={cell.isDisabled}
                  data-month={cell.month}
                  data-selected={cell.isSelected || undefined}
                  data-current={cell.isCurrentMonth || undefined}
                  data-disabled={cell.isDisabled || undefined}
                  aria-selected={cell.isSelected}
                  aria-disabled={cell.isDisabled}
                  aria-label={cell.label}
                >
                  {cell.label}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MonthView.displayName = 'MonthView';
