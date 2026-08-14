import { createDate, addDays, addMonths, subMonths, isSameDay, isSameMonth, isBeforeDay, isAfterDay, toNativeDate } from '../utils/dateAdapter';

export interface KeyboardRouterOptions {
  focusedDate: Date | null;
  viewDate: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  shouldDisableDate?: (date: Date) => boolean;
  onFocusChange: (date: Date) => void;
  onViewChange: (date: Date) => void;
  onSelect: (date: Date) => void;
}

/**
 * A framework-agnostic key event router mapped to standard WAI-ARIA grid specifications.
 * Handles arrow increments, page jumps, boundary limits, and view synchronization.
 * 
 * Accepts only native `KeyboardEvent` — React consumers should pass `e.nativeEvent`.
 */
export function handleCalendarKeyDown(e: KeyboardEvent, options: KeyboardRouterOptions): boolean {
  const { 
    focusedDate, 
    viewDate, 
    weekStartsOn = 0,
    minDate,
    maxDate,
    disabledDates,
    shouldDisableDate,
    onFocusChange,
    onViewChange,
    onSelect
  } = options;

  const currentFocus = createDate(focusedDate ?? viewDate);
  let handled = false;

  const isValidTarget = (nativeDate: Date): boolean => {
    const djs = createDate(nativeDate);
    if (minDate && isBeforeDay(djs, createDate(minDate))) return false;
    if (maxDate && isAfterDay(djs, createDate(maxDate))) return false;
    if (disabledDates?.some(disabled => isSameDay(djs, createDate(disabled)))) return false;
    if (shouldDisableDate?.(nativeDate)) return false;
    return true;
  };

  const updateFocus = (newNative: Date) => {
    if (!isValidTarget(newNative)) return;
    onFocusChange(newNative);

    // View Synchronizer: shift the grid display window smoothly
    // if the user arrows out of the currently visible month
    const viewDjs = createDate(viewDate);
    const newDjs = createDate(newNative);
    if (!isSameMonth(newDjs, viewDjs)) {
      onViewChange(newNative);
    }
  };

  switch (e.key) {
    case 'ArrowLeft':
      updateFocus(toNativeDate(addDays(currentFocus, -1)));
      handled = true;
      break;
    case 'ArrowRight':
      updateFocus(toNativeDate(addDays(currentFocus, 1)));
      handled = true;
      break;
    case 'ArrowUp':
      updateFocus(toNativeDate(addDays(currentFocus, -7)));
      handled = true;
      break;
    case 'ArrowDown':
      updateFocus(toNativeDate(addDays(currentFocus, 7)));
      handled = true;
      break;
    case 'PageUp':
      updateFocus(toNativeDate(e.shiftKey ? subMonths(currentFocus, 12) : subMonths(currentFocus, 1)));
      handled = true;
      break;
    case 'PageDown':
      updateFocus(toNativeDate(e.shiftKey ? addMonths(currentFocus, 12) : addMonths(currentFocus, 1)));
      handled = true;
      break;
    case 'Home': {
      const dayOfWeek = currentFocus.day();
      let diff = dayOfWeek - weekStartsOn;
      if (diff < 0) diff += 7;
      updateFocus(toNativeDate(addDays(currentFocus, -diff)));
      handled = true;
      break;
    }
    case 'End': {
      const dayOfWeek = currentFocus.day();
      let diff = dayOfWeek - weekStartsOn;
      if (diff < 0) diff += 7;
      const remaining = 6 - diff;
      updateFocus(toNativeDate(addDays(currentFocus, remaining)));
      handled = true;
      break;
    }
    case 'Enter':
    case ' ':
      if (focusedDate) {
        onSelect(focusedDate);
      }
      handled = true;
      break;
  }

  if (handled) {
    e.preventDefault();
    e.stopPropagation();
  }

  return handled;
}
