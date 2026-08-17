import type { ReapexLocale } from '../engine/locale';

export const es: ReapexLocale = {
  code: 'es',
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  weekStartsOn: 1,
  formats: { date: 'DD/MM/YYYY', dateTime: 'DD/MM/YYYY HH:mm', time: 'HH:mm' },
  dir: 'ltr',
  today: 'Hoy',
  clear: 'Limpiar',
  navigation: { prevMonth: 'Mes anterior', nextMonth: 'Mes siguiente', prevYear: 'Año anterior', nextYear: 'Año siguiente' }
};
