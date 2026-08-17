import type { ReapexLocale } from '../engine/locale';

export const ar: ReapexLocale = {
  code: 'ar',
  monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  monthNamesShort: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'],
  dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  dayNamesShort: ['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
  dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  weekStartsOn: 6,
  formats: { date: 'DD/MM/YYYY', dateTime: 'DD/MM/YYYY HH:mm', time: 'HH:mm' },
  dir: 'rtl',
  today: 'اليوم',
  clear: 'مسح',
  navigation: { prevMonth: 'الشهر السابق', nextMonth: 'الشهر التالي', prevYear: 'السنة السابقة', nextYear: 'السنة التالية' }
};
