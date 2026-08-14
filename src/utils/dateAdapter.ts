import dayjs, { Dayjs } from 'dayjs';

export type { Dayjs };

export function createDate(date?: Date | Dayjs | string | number | null): Dayjs {
  return dayjs(date ?? undefined);
}

export function startOfMonth(date: Dayjs): Dayjs {
  return date.startOf('month');
}

export function endOfMonth(date: Dayjs): Dayjs {
  return date.endOf('month');
}

export function addMonths(date: Dayjs, amount: number): Dayjs {
  return date.add(amount, 'month');
}

export function subMonths(date: Dayjs, amount: number): Dayjs {
  return date.subtract(amount, 'month');
}

export function addDays(date: Dayjs, amount: number): Dayjs {
  return date.add(amount, 'day');
}

export function isSameDay(date1: Dayjs, date2: Dayjs): boolean {
  return date1.isSame(date2, 'day');
}

export function isSameMonth(date1: Dayjs, date2: Dayjs): boolean {
  return date1.isSame(date2, 'month');
}

export function isBeforeDay(date1: Dayjs, date2: Dayjs): boolean {
  return date1.isBefore(date2, 'day');
}

export function isAfterDay(date1: Dayjs, date2: Dayjs): boolean {
  return date1.isAfter(date2, 'day');
}

export function toNativeDate(date: Dayjs): Date {
  return date.toDate();
}
