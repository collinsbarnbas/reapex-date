import { CalendarDay, DatePickerConfig, SinglePickerConfig, RangePickerConfig, MultiplePickerConfig } from './types';
import { createDate, startOfMonth, addDays, isSameMonth, isSameDay, isBeforeDay, isAfterDay, toNativeDate } from '../utils/dateAdapter';

export interface GenerateCalendarOptions {
  viewDate: Date;
  config: DatePickerConfig;
  hoverDate: Date | null;
  focusedDate: Date | null;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Pure, stateless, side-effect-free utility for 42-day matrix generation.
 * Handles grid shifting math, trailing/leading days, and bounds tracking immutably.
 */
export function generateCalendarMatrix({
  viewDate,
  config,
  hoverDate,
  focusedDate,
  weekStartsOn
}: GenerateCalendarOptions): CalendarDay[] {
  const viewDayjs = createDate(viewDate);
  const monthStart = startOfMonth(viewDayjs);
  const startDayOfWeek = monthStart.day();
  
  let trailingDays = startDayOfWeek - weekStartsOn;
  if (trailingDays < 0) {
    trailingDays += 7;
  }
  
  let currentDate = addDays(monthStart, -trailingDays);
  const today = createDate(new Date());
  const days: CalendarDay[] = [];
  
  const { mode, minDate, maxDate, disabledDates, shouldDisableDate } = config;

  for (let i = 0; i < 42; i++) {
    const isCurrentMonth = isSameMonth(currentDate, viewDayjs);
    const isToday = isSameDay(currentDate, today);
    const nativeDate = toNativeDate(currentDate);
    
    let isDisabled = false;
    if (minDate && isBeforeDay(currentDate, createDate(minDate))) isDisabled = true;
    if (maxDate && isAfterDay(currentDate, createDate(maxDate))) isDisabled = true;
    if (disabledDates?.some(d => isSameDay(currentDate, createDate(d)))) isDisabled = true;
    if (shouldDisableDate?.(nativeDate)) isDisabled = true;

    let isSelected = false;
    let isInRange = false;
    let isRangeStart = false;
    let isRangeEnd = false;
    let isFocused = false;
    let isHovered = false;

    if (focusedDate instanceof Date && isSameDay(currentDate, createDate(focusedDate))) {
      isFocused = true;
    }

    if (hoverDate instanceof Date && isSameDay(currentDate, createDate(hoverDate))) {
      isHovered = true;
    }
    
    if (mode === 'single') {
      const val = (config as SinglePickerConfig).value;
      if (val instanceof Date && isSameDay(currentDate, createDate(val))) {
        isSelected = true;
      }
    } else if (mode === 'multiple') {
      const vals = (config as MultiplePickerConfig).value;
      if (vals?.some(v => v instanceof Date && isSameDay(currentDate, createDate(v)))) {
        isSelected = true;
      }
    } else if (mode === 'range') {
      const [start, end] = (config as RangePickerConfig).value || [null, null];
      
      if (start instanceof Date && isSameDay(currentDate, createDate(start))) {
        isSelected = true;
        isRangeStart = true;
      }
      if (end instanceof Date && isSameDay(currentDate, createDate(end))) {
        isSelected = true;
        isRangeEnd = true;
      }
      
      if (start instanceof Date && end instanceof Date) {
        if (isAfterDay(currentDate, createDate(start)) && 
            isBeforeDay(currentDate, createDate(end))) {
          isInRange = true;
        }
      } else if (start instanceof Date && hoverDate instanceof Date) {
        const hoverDjs = createDate(hoverDate);
        const startDjs = createDate(start);
        if (isAfterDay(hoverDjs, startDjs)) {
           if (isAfterDay(currentDate, startDjs) && isBeforeDay(currentDate, hoverDjs)) {
             isInRange = true;
           }
        } else {
           if (isAfterDay(currentDate, hoverDjs) && isBeforeDay(currentDate, startDjs)) {
             isInRange = true;
           }
        }
      }
    }

    days.push({
      date: nativeDate,
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled,
      isInRange,
      isRangeStart,
      isRangeEnd,
      isHovered,
      isFocused
    });
    
    currentDate = addDays(currentDate, 1);
  }
  
  return days;
}
