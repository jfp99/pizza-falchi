/**
 * Date & Time Utility Functions
 *
 * TIMEZONE FIX: All functions work in UTC to prevent timezone-related bugs
 * Display formatting should happen client-side with user's timezone
 */

/**
 * Get the start of today in UTC
 * This ensures consistent "today" calculation regardless of server timezone
 */
export function getUTCToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0, 0, 0, 0
  ));
}

/**
 * Get the end of today in UTC
 */
export function getUTCEndOfDay(date?: Date): Date {
  const d = date || new Date();
  return new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    23, 59, 59, 999
  ));
}

/**
 * Get start of a specific date in UTC
 * @param date - Date to get start of (can be Date object or YYYY-MM-DD string)
 */
export function getUTCStartOfDay(date: Date | string): Date {
  let d: Date;

  if (typeof date === 'string') {
    // Parse YYYY-MM-DD string
    const [year, month, day] = date.split('-').map(Number);
    d = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  } else {
    d = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0, 0, 0, 0
    ));
  }

  return d;
}

/**
 * Check if two dates are the same day in UTC
 */
export function isSameUTCDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}

/**
 * Check if a date is today in UTC
 */
export function isUTCToday(date: Date): boolean {
  return isSameUTCDay(date, new Date());
}

/**
 * Add days to a date in UTC
 */
export function addUTCDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Get date range for a specific UTC date
 * Returns { start, end } for database queries
 */
export function getUTCDateRange(date: Date | string): { start: Date; end: Date } {
  const start = getUTCStartOfDay(date);
  const end = getUTCEndOfDay(start);
  return { start, end };
}

/**
 * Format date to YYYY-MM-DD in UTC
 * Use this for API parameters and database queries
 */
export function formatUTCDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to UTC Date
 */
export function parseUTCDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

/**
 * Get an array of UTC dates for the next N days
 */
export function getNextUTCDays(count: number, startDate?: Date): Date[] {
  const start = startDate ? getUTCStartOfDay(startDate) : getUTCToday();
  const days: Date[] = [];

  for (let i = 0; i < count; i++) {
    days.push(addUTCDays(start, i));
  }

  return days;
}

/**
 * Check if a date is in the past (UTC)
 */
export function isUTCPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Check if a date is in the future (UTC)
 */
export function isUTCFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Get the day of week in UTC (0 = Sunday, 6 = Saturday)
 */
export function getUTCDayOfWeek(date: Date): number {
  return date.getUTCDay();
}

/**
 * Get day name in French (for UI display)
 */
export function getUTCDayName(date: Date, locale: string = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    timeZone: 'UTC'
  }).format(date);
}
