import React, { useMemo, useCallback } from 'react';
import type { YearCell } from '../../engine/types';
import { generateYearGrid } from '../../engine/yearGrid';

export interface YearViewProps {
  viewYear: number;
  minDate?: Date;
  maxDate?: Date;
  onYearSelect: (year: number) => void;
  className?: string;
}

/**
 * 4×3 grid of year buttons for the decade selector view.
 * Exposes data attributes for complete styling freedom.
 */
export const YearView: React.FC<YearViewProps> = ({
  viewYear,
  minDate,
  maxDate,
  onYearSelect,
  className
}) => {
  const years = useMemo(() =>
    generateYearGrid({
      currentYear: viewYear,
      minDate,
      maxDate,
      selectedYear: viewYear
    }),
    [viewYear, minDate, maxDate]
  );

  const handleClick = useCallback((cell: YearCell) => {
    if (cell.isDisabled) return;
    onYearSelect(cell.year);
  }, [onYearSelect]);

  // Chunk into 4 rows of 3
  const rows = useMemo(() => {
    const result: YearCell[][] = [];
    for (let i = 0; i < 12; i += 3) {
      result.push(years.slice(i, i + 3));
    }
    return result;
  }, [years]);

  return (
    <table
      className={className}
      role="grid"
      aria-label="Year selector"
      data-year-grid=""
    >
      <tbody role="rowgroup">
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx} role="row">
            {row.map((cell) => (
              <td key={cell.year} role="gridcell">
                <button
                  type="button"
                  onClick={() => handleClick(cell)}
                  disabled={cell.isDisabled}
                  data-year={cell.year}
                  data-selected={cell.isSelected || undefined}
                  data-current={cell.isCurrentYear || undefined}
                  data-disabled={cell.isDisabled || undefined}
                  aria-selected={cell.isSelected}
                  aria-disabled={cell.isDisabled}
                  aria-label={String(cell.year)}
                >
                  {cell.year}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

YearView.displayName = 'YearView';
