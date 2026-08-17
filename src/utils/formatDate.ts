import { createDate } from './dateAdapter';

const TOKEN_MAP: Record<string, (date: Date) => string> = {
  'YYYY': (d) => d.getFullYear().toString(),
  'YY': (d) => d.getFullYear().toString().slice(-2),
  'MMMM': (d) => MONTH_NAMES_LONG[d.getMonth()] ?? '',
  'MMM': (d) => MONTH_NAMES_SHORT[d.getMonth()] ?? '',
  'MM': (d) => String(d.getMonth() + 1).padStart(2, '0'),
  'M': (d) => String(d.getMonth() + 1),
  'DD': (d) => String(d.getDate()).padStart(2, '0'),
  'D': (d) => String(d.getDate()),
  'dddd': (d) => DAY_NAMES_LONG[d.getDay()] ?? '',
  'ddd': (d) => DAY_NAMES_SHORT[d.getDay()] ?? '',
  'dd': (d) => DAY_NAMES_MIN[d.getDay()] ?? '',
};

const MONTH_NAMES_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

const DAY_NAMES_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] as const;

const DAY_NAMES_SHORT = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
] as const;

const DAY_NAMES_MIN = [
  'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'
] as const;

// Sorted longest-first to match greedily
const SORTED_TOKENS = Object.keys(TOKEN_MAP).sort((a, b) => b.length - a.length);

/**
 * Formats a Date object into a display string using the given format pattern.
 * Supported tokens: YYYY, YY, MMMM, MMM, MM, M, DD, D, dddd, ddd, dd
 * 
 * @example formatDate(new Date(2026, 0, 15), 'MM/DD/YYYY') → '01/15/2026'
 * @example formatDate(new Date(2026, 0, 15), 'MMMM D, YYYY') → 'January 15, 2026'
 */
export function formatDate(date: Date, format: string): string {
  let result = '';
  let i = 0;

  while (i < format.length) {
    let matched = false;

    for (const token of SORTED_TOKENS) {
      if (format.startsWith(token, i)) {
        const formatter = TOKEN_MAP[token];
        if (formatter) {
          result += formatter(date);
        }
        i += token.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result += format[i];
      i++;
    }
  }

  return result;
}

/**
 * Parses a user-typed string into a Date object using the given format pattern.
 * Returns null if the string doesn't match the expected format or results in an invalid date.
 * 
 * @example parseDate('01/15/2026', 'MM/DD/YYYY') → Date(2026, 0, 15)
 * @example parseDate('invalid', 'MM/DD/YYYY') → null
 */
export function parseDate(input: string, format: string): Date | null {
  let year = -1;
  let month = -1;
  let day = -1;
  let inputPos = 0;
  let formatPos = 0;

  while (formatPos < format.length && inputPos < input.length) {
    let matched = false;

    for (const token of SORTED_TOKENS) {
      if (!format.startsWith(token, formatPos)) continue;

      matched = true;
      formatPos += token.length;

      if (token === 'YYYY') {
        const chunk = input.slice(inputPos, inputPos + 4);
        const val = parseInt(chunk, 10);
        if (isNaN(val)) return null;
        year = val;
        inputPos += 4;
      } else if (token === 'YY') {
        const chunk = input.slice(inputPos, inputPos + 2);
        const val = parseInt(chunk, 10);
        if (isNaN(val)) return null;
        year = 2000 + val;
        inputPos += 2;
      } else if (token === 'MM') {
        const chunk = input.slice(inputPos, inputPos + 2);
        const val = parseInt(chunk, 10);
        if (isNaN(val) || val < 1 || val > 12) return null;
        month = val - 1;
        inputPos += 2;
      } else if (token === 'M') {
        // Consume 1 or 2 digits
        const twoChar = input.slice(inputPos, inputPos + 2);
        const twoVal = parseInt(twoChar, 10);
        if (!isNaN(twoVal) && twoVal >= 1 && twoVal <= 12 && twoChar.length === 2 && /^\d{2}$/.test(twoChar)) {
          month = twoVal - 1;
          inputPos += 2;
        } else {
          const oneChar = input.slice(inputPos, inputPos + 1);
          const oneVal = parseInt(oneChar, 10);
          if (isNaN(oneVal) || oneVal < 1 || oneVal > 9) return null;
          month = oneVal - 1;
          inputPos += 1;
        }
      } else if (token === 'DD') {
        const chunk = input.slice(inputPos, inputPos + 2);
        const val = parseInt(chunk, 10);
        if (isNaN(val) || val < 1 || val > 31) return null;
        day = val;
        inputPos += 2;
      } else if (token === 'D') {
        const twoChar = input.slice(inputPos, inputPos + 2);
        const twoVal = parseInt(twoChar, 10);
        if (!isNaN(twoVal) && twoVal >= 1 && twoVal <= 31 && twoChar.length === 2 && /^\d{2}$/.test(twoChar)) {
          day = twoVal;
          inputPos += 2;
        } else {
          const oneChar = input.slice(inputPos, inputPos + 1);
          const oneVal = parseInt(oneChar, 10);
          if (isNaN(oneVal) || oneVal < 1 || oneVal > 9) return null;
          day = oneVal;
          inputPos += 1;
        }
      } else {
        // Skip text tokens (MMMM, MMM, dddd, ddd, dd) — not parseable reliably
        // Just advance input past non-digit characters
        while (inputPos < input.length && /[a-zA-Z]/.test(input[inputPos] ?? '')) {
          inputPos++;
        }
      }
      break;
    }

    if (!matched) {
      // Literal character — must match exactly
      if (input[inputPos] !== format[formatPos]) return null;
      inputPos++;
      formatPos++;
    }
  }

  if (year < 0 || month < 0 || day < 0) return null;

  // Validate the constructed date is real (e.g., Feb 30 is not valid)
  const constructed = new Date(year, month, day);
  if (
    constructed.getFullYear() !== year ||
    constructed.getMonth() !== month ||
    constructed.getDate() !== day
  ) {
    return null;
  }

  // Verify via our adapter that it's a valid dayjs date
  const validated = createDate(constructed);
  if (!validated.isValid()) return null;

  return constructed;
}
