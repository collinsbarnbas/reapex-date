import { useState, useCallback, useMemo } from 'react';
import type { CalendarView } from '../engine/types';

export interface UseCalendarViewReturn {
  activeView: CalendarView;
  setView: (view: CalendarView) => void;
  goToDayView: () => void;
  goToMonthView: () => void;
  goToYearView: () => void;
  /** Cycles through views: day → month → year on title click */
  cycleTitleView: () => void;
}

/**
 * Manages the active view state (day | month | year) for the calendar.
 * Provides clean API methods for view transitions.
 */
export function useCalendarView(initialView: CalendarView = 'day'): UseCalendarViewReturn {
  const [activeView, setActiveView] = useState<CalendarView>(initialView);

  const goToDayView = useCallback(() => setActiveView('day'), []);
  const goToMonthView = useCallback(() => setActiveView('month'), []);
  const goToYearView = useCallback(() => setActiveView('year'), []);

  const cycleTitleView = useCallback(() => {
    setActiveView(prev => {
      if (prev === 'day') return 'month';
      if (prev === 'month') return 'year';
      return 'day';
    });
  }, []);

  return useMemo(() => ({
    activeView,
    setView: setActiveView,
    goToDayView,
    goToMonthView,
    goToYearView,
    cycleTitleView
  }), [activeView, goToDayView, goToMonthView, goToYearView, cycleTitleView]);
}
