/**
 * ReApexDate Locale Configuration Interface.
 * Defines all localizable strings, formatting rules, and layout direction.
 */
export interface ReapexLocale {
  /** Locale code (e.g. 'en', 'fr', 'ar') */
  code: string;
  /** Full month names (January–December). Must be exactly 12 items. */
  monthNames: readonly string[];
  /** Abbreviated month names (Jan–Dec). Must be exactly 12 items. */
  monthNamesShort: readonly string[];
  /** Full day names (Sunday–Saturday). Must be exactly 7 items, starting from Sunday (index 0). */
  dayNames: readonly string[];
  /** Short day names (Sun–Sat). Must be exactly 7 items. */
  dayNamesShort: readonly string[];
  /** Minimal day names (Su–Sa). Must be exactly 7 items. */
  dayNamesMin: readonly string[];
  /** First day of the week: 0=Sunday, 1=Monday, 6=Saturday. */
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Default date display format tokens. */
  formats: {
    date: string;
    dateTime: string;
    time: string;
  };
  /** Text direction. */
  dir: 'ltr' | 'rtl';
  /** "Today" button label */
  today: string;
  /** Clear button aria-label */
  clear: string;
  /** Navigation aria-labels */
  navigation: {
    prevMonth: string;
    nextMonth: string;
    prevYear: string;
    nextYear: string;
  };
}
