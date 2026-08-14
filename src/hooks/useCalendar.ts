import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { DatePickerConfig, CalendarDay, SinglePickerConfig, RangePickerConfig, MultiplePickerConfig } from '../engine/types';
import { generateCalendarMatrix } from '../engine/calendar';
import { createDate, addMonths, subMonths, isSameDay, isBeforeDay, toNativeDate } from '../utils/dateAdapter';

export interface UseCalendarConfigBase {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  shouldDisableDate?: (date: Date) => boolean;
}

export interface UseSingleCalendarConfig extends UseCalendarConfigBase {
  mode: 'single';
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export interface UseRangeCalendarConfig extends UseCalendarConfigBase {
  mode: 'range';
  value: [Date | null, Date | null];
  onChange: (range: [Date | null, Date | null]) => void;
}

export interface UseMultipleCalendarConfig extends UseCalendarConfigBase {
  mode: 'multiple';
  value: Date[];
  onChange: (dates: Date[]) => void;
}

export type UseCalendarConfig = UseSingleCalendarConfig | UseRangeCalendarConfig | UseMultipleCalendarConfig;

export interface UseCalendarProps<T extends UseCalendarConfig> {
  config: T;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CalendarCoreState {
  viewDate: Date;
  calendarDays: CalendarDay[];
  navigateNextMonth: () => void;
  navigatePrevMonth: () => void;
  navigateNextYear: () => void;
  navigatePrevYear: () => void;
  setViewDate: (date: Date) => void;
  setHoverDate: (date: Date | null) => void;
  setFocusedDate: (date: Date | null) => void;
}

export interface SingleCalendarResult extends CalendarCoreState {
  mode: 'single';
  value: Date | null;
  selectDate: (date: Date) => void;
}

export interface RangeCalendarResult extends CalendarCoreState {
  mode: 'range';
  value: [Date | null, Date | null];
  hoverDate: Date | null;
  selectDate: (date: Date) => void;
}

export interface MultipleCalendarResult extends CalendarCoreState {
  mode: 'multiple';
  value: Date[];
  selectDate: (date: Date) => void;
}

export type CalendarResult<T extends UseCalendarConfig> = 
  T extends UseSingleCalendarConfig ? SingleCalendarResult :
  T extends UseRangeCalendarConfig ? RangeCalendarResult :
  T extends UseMultipleCalendarConfig ? MultipleCalendarResult :
  never;

export function useCalendar<T extends UseCalendarConfig>({ config, weekStartsOn = 0 }: UseCalendarProps<T>): CalendarResult<T> {
  const configRef = useRef(config);
  
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const [viewDate, setViewDate] = useState<Date>(() => {
    const c = config as UseCalendarConfig;
    if (c.mode === 'single' && c.value instanceof Date) return c.value;
    if (c.mode === 'range' && c.value?.[0] instanceof Date) return c.value[0];
    if (c.mode === 'multiple' && c.value?.[0] instanceof Date) return c.value[0];
    return new Date();
  });

  const [hoverDate, setHoverDateState] = useState<Date | null>(null);
  const [focusedDate, setFocusedDateState] = useState<Date | null>(null);

  const navigateNextMonth = useCallback(() => {
    setViewDate(prev => toNativeDate(addMonths(createDate(prev), 1)));
  }, []);

  const navigatePrevMonth = useCallback(() => {
    setViewDate(prev => toNativeDate(subMonths(createDate(prev), 1)));
  }, []);

  const navigateNextYear = useCallback(() => {
    setViewDate(prev => toNativeDate(addMonths(createDate(prev), 12)));
  }, []);

  const navigatePrevYear = useCallback(() => {
    setViewDate(prev => toNativeDate(subMonths(createDate(prev), 12)));
  }, []);

  const setHoverDate = useCallback((date: Date | null) => {
    setHoverDateState(date);
  }, []);

  const setFocusedDate = useCallback((date: Date | null) => {
    setFocusedDateState(date);
  }, []);

  const selectDate = useCallback((date: Date) => {
    const c = configRef.current;
    if (c.mode === 'single') {
      c.onChange(date);
    } else if (c.mode === 'multiple') {
      const values = c.value || [];
      const exists = values.find(v => isSameDay(createDate(v), createDate(date)));
      if (exists) {
        c.onChange(values.filter(v => v !== exists));
      } else {
        c.onChange([...values, date]);
      }
    } else if (c.mode === 'range') {
      const [start, end] = c.value || [null, null];
      
      if (!start || (start && end)) {
        c.onChange([date, null]);
      } else {
        const startDjs = createDate(start);
        const newDjs = createDate(date);
        
        if (isBeforeDay(newDjs, startDjs)) {
          c.onChange([date, start]);
        } else {
          c.onChange([start, date]);
        }
      }
    }
  }, []);

  // Isolate Engine Config mapping
  const engineConfig = useMemo((): DatePickerConfig => {
    const c = config as UseCalendarConfig;
    const base = {
      minDate: c.minDate,
      maxDate: c.maxDate,
      disabledDates: c.disabledDates,
      shouldDisableDate: c.shouldDisableDate,
    };
    if (c.mode === 'single') {
      return { ...base, mode: 'single', value: c.value };
    }
    if (c.mode === 'range') {
      return { ...base, mode: 'range', value: c.value };
    }
    return { ...base, mode: 'multiple', value: c.value };
  }, [config.mode, (config as UseCalendarConfig).value, config.minDate, config.maxDate, config.disabledDates, config.shouldDisableDate]);

  const calendarDays = useMemo(() => {
    return generateCalendarMatrix({
      viewDate,
      config: engineConfig,
      hoverDate,
      focusedDate,
      weekStartsOn
    });
  }, [viewDate, engineConfig, hoverDate, focusedDate, weekStartsOn]);

  const coreState = useMemo(() => ({
    viewDate,
    calendarDays,
    navigateNextMonth,
    navigatePrevMonth,
    navigateNextYear,
    navigatePrevYear,
    setViewDate,
    setHoverDate,
    setFocusedDate
  }), [
    viewDate,
    calendarDays,
    navigateNextMonth,
    navigatePrevMonth,
    navigateNextYear,
    navigatePrevYear,
    setViewDate,
    setHoverDate,
    setFocusedDate
  ]);

  return useMemo(() => {
    const c = config as UseCalendarConfig;
    if (c.mode === 'single') {
      return {
        ...coreState,
        mode: 'single',
        value: c.value,
        selectDate
      } as CalendarResult<T>;
    } else if (c.mode === 'range') {
      return {
        ...coreState,
        mode: 'range',
        value: c.value,
        hoverDate,
        selectDate
      } as CalendarResult<T>;
    } else {
      return {
        ...coreState,
        mode: 'multiple',
        value: c.value,
        selectDate
      } as CalendarResult<T>;
    }
  }, [coreState, config.mode, (config as UseCalendarConfig).value, hoverDate, selectDate]);
}
