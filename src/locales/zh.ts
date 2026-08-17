import type { ReapexLocale } from '../engine/locale';

export const zh: ReapexLocale = {
  code: 'zh',
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
  weekStartsOn: 1,
  formats: { date: 'YYYY-MM-DD', dateTime: 'YYYY-MM-DD HH:mm', time: 'HH:mm' },
  dir: 'ltr',
  today: '今天',
  clear: '清除',
  navigation: { prevMonth: '上个月', nextMonth: '下个月', prevYear: '上一年', nextYear: '下一年' }
};
