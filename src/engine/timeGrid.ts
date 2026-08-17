export interface TimeValue {
  hour: number;
  minute: number;
  second: number;
}

export interface HourCell {
  value: number;
  label: string;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface MinuteCell {
  value: number;
  label: string;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface GenerateHourGridOptions {
  selectedHour?: number;
  use12Hour?: boolean;
  disabledHours?: number[];
}

export interface GenerateMinuteGridOptions {
  selectedMinute?: number;
  minuteStep?: number;
  disabledMinutes?: number[];
}

/**
 * Generate a list of hour cells for the time picker.
 * Supports both 12-hour and 24-hour formats.
 */
export function generateHourGrid({
  selectedHour,
  use12Hour = false,
  disabledHours = []
}: GenerateHourGridOptions): HourCell[] {
  const count = use12Hour ? 12 : 24;
  const cells: HourCell[] = [];

  for (let i = 0; i < count; i++) {
    const hourValue = use12Hour ? (i === 0 ? 12 : i) : i;
    const label = use12Hour
      ? String(hourValue)
      : String(i).padStart(2, '0');

    cells.push({
      value: i,
      label,
      isSelected: selectedHour !== undefined && i === (use12Hour ? selectedHour % 12 : selectedHour),
      isDisabled: disabledHours.includes(i)
    });
  }

  return cells;
}

/**
 * Generate a list of minute cells for the time picker.
 * Supports configurable step intervals (default: 1 minute).
 */
export function generateMinuteGrid({
  selectedMinute,
  minuteStep = 1,
  disabledMinutes = []
}: GenerateMinuteGridOptions): MinuteCell[] {
  const cells: MinuteCell[] = [];
  const step = Math.max(1, Math.min(60, minuteStep));

  for (let i = 0; i < 60; i += step) {
    cells.push({
      value: i,
      label: String(i).padStart(2, '0'),
      isSelected: selectedMinute !== undefined && i === selectedMinute,
      isDisabled: disabledMinutes.includes(i)
    });
  }

  return cells;
}

/**
 * Convert 12-hour format to 24-hour format.
 */
export function to24Hour(hour12: number, meridiem: 'AM' | 'PM'): number {
  if (meridiem === 'AM') {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

/**
 * Convert 24-hour format to 12-hour format with meridiem.
 */
export function to12Hour(hour24: number): { hour: number; meridiem: 'AM' | 'PM' } {
  if (hour24 === 0) return { hour: 12, meridiem: 'AM' };
  if (hour24 < 12) return { hour: hour24, meridiem: 'AM' };
  if (hour24 === 12) return { hour: 12, meridiem: 'PM' };
  return { hour: hour24 - 12, meridiem: 'PM' };
}

/**
 * Format a TimeValue into a display string.
 */
export function formatTime(time: TimeValue, use12Hour: boolean = false): string {
  if (use12Hour) {
    const { hour, meridiem } = to12Hour(time.hour);
    return `${String(hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')} ${meridiem}`;
  }
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}
