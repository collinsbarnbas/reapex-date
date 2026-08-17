import { useState, useCallback, useMemo } from 'react';
import type { TimeValue } from '../engine/timeGrid';
import { to24Hour, to12Hour } from '../engine/timeGrid';

export interface UseTimePickerOptions {
  /** Initial time value */
  value?: TimeValue;
  /** Called when time changes */
  onChange?: (time: TimeValue) => void;
  /** Use 12-hour format with AM/PM */
  use12Hour?: boolean;
  /** Minute step interval (default 1) */
  minuteStep?: number;
  /** Hours that cannot be selected */
  disabledHours?: number[];
  /** Minutes that cannot be selected */
  disabledMinutes?: number[];
}

export interface UseTimePickerReturn {
  hour: number;
  minute: number;
  second: number;
  meridiem: 'AM' | 'PM';
  setHour: (hour: number) => void;
  setMinute: (minute: number) => void;
  setSecond: (second: number) => void;
  toggleMeridiem: () => void;
  setMeridiem: (m: 'AM' | 'PM') => void;
  /** The full TimeValue in 24-hour format */
  timeValue: TimeValue;
}

/**
 * Stateful hook for managing time picker state.
 * Handles 12h/24h conversion internally.
 */
export function useTimePicker({
  value,
  onChange,
  use12Hour = false,
  minuteStep = 1,
  disabledHours = [],
  disabledMinutes = []
}: UseTimePickerOptions = {}): UseTimePickerReturn {
  const [internalTime, setInternalTime] = useState<TimeValue>(
    value ?? { hour: 0, minute: 0, second: 0 }
  );

  const currentTime = value ?? internalTime;

  const update = useCallback((newTime: TimeValue) => {
    setInternalTime(newTime);
    onChange?.(newTime);
  }, [onChange]);

  const setHour = useCallback((h: number) => {
    if (disabledHours.includes(h)) return;
    update({ ...currentTime, hour: h });
  }, [currentTime, update, disabledHours]);

  const setMinute = useCallback((m: number) => {
    if (disabledMinutes.includes(m)) return;
    update({ ...currentTime, minute: m });
  }, [currentTime, update, disabledMinutes]);

  const setSecond = useCallback((s: number) => {
    update({ ...currentTime, second: s });
  }, [currentTime, update]);

  const { hour: displayHour, meridiem } = useMemo(
    () => to12Hour(currentTime.hour),
    [currentTime.hour]
  );

  const toggleMeridiem = useCallback(() => {
    const newMeridiem = meridiem === 'AM' ? 'PM' : 'AM';
    const hour12 = displayHour;
    const newHour24 = to24Hour(hour12, newMeridiem);
    if (disabledHours.includes(newHour24)) return;
    update({ ...currentTime, hour: newHour24 });
  }, [meridiem, displayHour, currentTime, update, disabledHours]);

  const setMeridiem = useCallback((m: 'AM' | 'PM') => {
    if (m === meridiem) return;
    toggleMeridiem();
  }, [meridiem, toggleMeridiem]);

  return useMemo(() => ({
    hour: currentTime.hour,
    minute: currentTime.minute,
    second: currentTime.second,
    meridiem,
    setHour,
    setMinute,
    setSecond,
    toggleMeridiem,
    setMeridiem,
    timeValue: currentTime
  }), [currentTime, meridiem, setHour, setMinute, setSecond, toggleMeridiem, setMeridiem]);
}
