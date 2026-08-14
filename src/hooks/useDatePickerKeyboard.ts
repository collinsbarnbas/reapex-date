import { useState, useCallback, useMemo } from 'react';
import type { Dayjs } from 'dayjs';
import { CalendarDay, DatePickerBaseConfig } from '../engine/types';
import { createDate, addDays, addMonths, subMonths, isSameDay, isSameMonth, toNativeDate } from '../utils/dateAdapter';

export interface UseDatePickerKeyboardProps {
  calendarDays: CalendarDay[];
  viewDate: Date;
  setViewDate: (date: Date) => void;
  selectDate: (date: Date) => void;
  config: DatePickerBaseConfig;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export function useDatePickerKeyboard({
  calendarDays,
  viewDate,
  setViewDate,
  selectDate,
  config,
  weekStartsOn = 0
}: UseDatePickerKeyboardProps) {
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);

  const { minDate, maxDate, disabledDates, shouldDisableDate } = config;

  // Boundary safety guard — strictly typed, zero `any`
  const isValidDate = useCallback((djs: Dayjs): boolean => {
    if (minDate && djs.isBefore(createDate(minDate), 'day')) return false;
    if (maxDate && djs.isAfter(createDate(maxDate), 'day')) return false;
    if (disabledDates?.some(disabled => isSameDay(djs, createDate(disabled)))) return false;
    if (shouldDisableDate?.(toNativeDate(djs))) return false;
    return true;
  }, [minDate, maxDate, disabledDates, shouldDisableDate]);

  const updateFocus = useCallback((newDateDjs: Dayjs) => {
    if (!isValidDate(newDateDjs)) return;
    
    const newNativeDate = toNativeDate(newDateDjs);
    setFocusedDate(newNativeDate);

    // Auto-View Optimization: Sync view window if the focus steps outside current month
    const viewDjs = createDate(viewDate);
    if (!isSameMonth(newDateDjs, viewDjs)) {
      setViewDate(newNativeDate);
    }
  }, [isValidDate, viewDate, setViewDate]);

  // Complete WAI-ARIA Matrix
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Default focus to viewDate if nothing is focused yet
    const currentFocus = focusedDate ? createDate(focusedDate) : createDate(viewDate);
    
    let handled = false;
    switch (e.key) {
      case 'ArrowLeft':
        updateFocus(addDays(currentFocus, -1));
        handled = true;
        break;
      case 'ArrowRight':
        updateFocus(addDays(currentFocus, 1));
        handled = true;
        break;
      case 'ArrowUp':
        updateFocus(addDays(currentFocus, -7));
        handled = true;
        break;
      case 'ArrowDown':
        updateFocus(addDays(currentFocus, 7));
        handled = true;
        break;
      case 'PageUp':
        if (e.shiftKey) {
          updateFocus(subMonths(currentFocus, 12));
        } else {
          updateFocus(subMonths(currentFocus, 1));
        }
        handled = true;
        break;
      case 'PageDown':
        if (e.shiftKey) {
          updateFocus(addMonths(currentFocus, 12));
        } else {
          updateFocus(addMonths(currentFocus, 1));
        }
        handled = true;
        break;
      case 'Home': {
        const dayOfWeek = currentFocus.day();
        let diff = dayOfWeek - weekStartsOn;
        if (diff < 0) diff += 7;
        updateFocus(addDays(currentFocus, -diff));
        handled = true;
        break;
      }
      case 'End': {
        const dayOfWeek = currentFocus.day();
        let diff = dayOfWeek - weekStartsOn;
        if (diff < 0) diff += 7;
        const remaining = 6 - diff;
        updateFocus(addDays(currentFocus, remaining));
        handled = true;
        break;
      }
      case 'Enter':
      case ' ':
        if (focusedDate) {
          selectDate(focusedDate);
        }
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [focusedDate, viewDate, updateFocus, selectDate, weekStartsOn]);

  // Augment base core days matrix with `isFocused: true` dynamically
  const enhancedDays = useMemo(() => {
    return calendarDays.map(day => {
      let isFocused = false;
      if (focusedDate && isSameDay(createDate(day.date), createDate(focusedDate))) {
        isFocused = true;
      }
      return { ...day, isFocused };
    });
  }, [calendarDays, focusedDate]);

  return {
    calendarDays: enhancedDays,
    handleKeyDown,
    focusedDate,
    setFocusedDate,
  };
}
