// ──────────────────────────────────────────────
// reapex-date — Public API (v0.4.0)
// ──────────────────────────────────────────────

// Components
export { CalendarRoot, CalendarHeader, CalendarGrid, MonthView, YearView, DatePickerInput, TimePicker, DateTimePicker, Presets } from './components';
export type { CalendarRootProps, CalendarHeaderProps, CalendarGridProps, MonthViewProps, YearViewProps, DatePickerInputProps, TimePickerProps, DateTimePickerProps, PresetsProps, PresetItem } from './components';

// Hooks
export { useCalendar, useDatePickerKeyboard, useCalendarView, useDatePickerPopover, useTimePicker } from './hooks';
export type {
  UseCalendarConfig,
  UseSingleCalendarConfig,
  UseRangeCalendarConfig,
  UseMultipleCalendarConfig,
  UseCalendarProps,
  CalendarCoreState,
  SingleCalendarResult,
  RangeCalendarResult,
  MultipleCalendarResult,
  CalendarResult,
  UseDatePickerKeyboardProps,
  UseCalendarViewReturn,
  UseDatePickerPopoverReturn,
  UseTimePickerOptions,
  UseTimePickerReturn
} from './hooks';

// Engine (framework-agnostic)
export { generateCalendarMatrix, generateMonthGrid, generateYearGrid, getDecadeLabel, generateHourGrid, generateMinuteGrid, to24Hour, to12Hour, formatTime } from './engine';
export type {
  GenerateCalendarOptions,
  GenerateMonthGridOptions,
  GenerateYearGridOptions,
  GenerateHourGridOptions,
  GenerateMinuteGridOptions,
  TimeValue,
  HourCell,
  MinuteCell,
  PickerMode,
  CalendarView,
  CalendarDay,
  MonthCell,
  YearCell,
  DatePickerBaseConfig,
  SinglePickerConfig,
  RangePickerConfig,
  MultiplePickerConfig,
  DatePickerConfig,
  ReapexLocale
} from './engine';

// Accessibility
export { handleCalendarKeyDown, useFocusTrap, useClickOutside } from './a11y';
export type { KeyboardRouterOptions } from './a11y';

// Utilities
export { formatDate, parseDate } from './utils/formatDate';

// Built-in Locales
export { en, es, fr, de, ja, zh, ar, hi } from './locales';
