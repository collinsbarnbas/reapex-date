export type PickerMode = 'single' | 'range' | 'multiple';

export type CalendarView = 'day' | 'month' | 'year';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isHovered: boolean;
  isFocused: boolean;
}

export interface MonthCell {
  month: number;
  label: string;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface YearCell {
  year: number;
  isCurrentYear: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface DatePickerBaseConfig {
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  shouldDisableDate?: (date: Date) => boolean;
}

export interface SinglePickerConfig extends DatePickerBaseConfig {
  mode: 'single';
  value: Date | null;
}

export interface RangePickerConfig extends DatePickerBaseConfig {
  mode: 'range';
  value: [Date | null, Date | null];
}

export interface MultiplePickerConfig extends DatePickerBaseConfig {
  mode: 'multiple';
  value: Date[];
}

export type DatePickerConfig = SinglePickerConfig | RangePickerConfig | MultiplePickerConfig;
