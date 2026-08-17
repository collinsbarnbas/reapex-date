import type { ReapexLocale } from '../engine/locale';

export const hi: ReapexLocale = {
  code: 'hi',
  monthNames: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  monthNamesShort: ['जन', 'फ़र', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'],
  dayNames: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  dayNamesShort: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  dayNamesMin: ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'],
  weekStartsOn: 0,
  formats: { date: 'DD/MM/YYYY', dateTime: 'DD/MM/YYYY hh:mm A', time: 'hh:mm A' },
  dir: 'ltr',
  today: 'आज',
  clear: 'हटाएं',
  navigation: { prevMonth: 'पिछला महीना', nextMonth: 'अगला महीना', prevYear: 'पिछला वर्ष', nextYear: 'अगला वर्ष' }
};
