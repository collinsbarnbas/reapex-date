import type { ReapexLocale } from '../engine/locale';

export const de: ReapexLocale = {
  code: 'de',
  monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  weekStartsOn: 1,
  formats: { date: 'DD.MM.YYYY', dateTime: 'DD.MM.YYYY HH:mm', time: 'HH:mm' },
  dir: 'ltr',
  today: 'Heute',
  clear: 'Löschen',
  navigation: { prevMonth: 'Vorheriger Monat', nextMonth: 'Nächster Monat', prevYear: 'Vorheriges Jahr', nextYear: 'Nächstes Jahr' }
};
