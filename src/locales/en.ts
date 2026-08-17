import type { ReapexLocale } from '../engine/locale';

export const en: ReapexLocale = {
  code: 'en',
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  weekStartsOn: 0,
  formats: { date: 'MM/DD/YYYY', dateTime: 'MM/DD/YYYY hh:mm A', time: 'hh:mm A' },
  dir: 'ltr',
  today: 'Today',
  clear: 'Clear',
  navigation: { prevMonth: 'Previous month', nextMonth: 'Next month', prevYear: 'Previous year', nextYear: 'Next year' }
};
