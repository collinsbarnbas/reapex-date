import type { ReapexLocale } from '../engine/locale';

export const ja: ReapexLocale = {
  code: 'ja',
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
  dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'],
  weekStartsOn: 0,
  formats: { date: 'YYYY/MM/DD', dateTime: 'YYYY/MM/DD HH:mm', time: 'HH:mm' },
  dir: 'ltr',
  today: '今日',
  clear: 'クリア',
  navigation: { prevMonth: '前月', nextMonth: '翌月', prevYear: '前年', nextYear: '翌年' }
};
