import type { ReapexLocale } from '../engine/locale';

export const fr: ReapexLocale = {
  code: 'fr',
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
  weekStartsOn: 1,
  formats: { date: 'DD/MM/YYYY', dateTime: 'DD/MM/YYYY HH:mm', time: 'HH:mm' },
  dir: 'ltr',
  today: "Aujourd'hui",
  clear: 'Effacer',
  navigation: { prevMonth: 'Mois précédent', nextMonth: 'Mois suivant', prevYear: 'Année précédente', nextYear: 'Année suivante' }
};
