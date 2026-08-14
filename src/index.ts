// ──────────────────────────────────────────────
// reapex-date — Public API
// ──────────────────────────────────────────────

// Components
export { CalendarRoot, CalendarHeader, CalendarGrid } from './components';
export type { CalendarRootProps, CalendarHeaderProps, CalendarGridProps } from './components';

// Hooks
export { useCalendar } from './hooks';
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
  CalendarResult
} from './hooks';

export { useDatePickerKeyboard } from './hooks';
export type { UseDatePickerKeyboardProps } from './hooks';

// Engine (framework-agnostic)
export { generateCalendarMatrix } from './engine';
export type { GenerateCalendarOptions } from './engine';
export type {
  PickerMode,
  CalendarDay,
  DatePickerBaseConfig,
  SinglePickerConfig,
  RangePickerConfig,
  MultiplePickerConfig,
  DatePickerConfig
} from './engine';

// Accessibility
export { handleCalendarKeyDown } from './a11y';
export type { KeyboardRouterOptions } from './a11y';
export { useFocusTrap } from './a11y';
