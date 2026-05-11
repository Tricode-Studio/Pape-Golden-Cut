// Synced from Tricode CMS workspace.booking snapshot — 2026-05-08
// Source: GET /public/pape-golden-cuts/integration-manifest

export const BOOKING_CONFIG = {
  slotMinutes: 30,
  maxAdvanceDays: 30,
  timezone: 'America/Montevideo',
  // day 0 = Sunday, day 6 = Saturday
  workingDays: [
    { day: 0, enabled: false, start: '09:00', end: '13:00' },
    { day: 1, enabled: true,  start: '09:00', end: '18:00' },
    { day: 2, enabled: true,  start: '09:00', end: '18:00' },
    { day: 3, enabled: true,  start: '09:00', end: '18:00' },
    { day: 4, enabled: true,  start: '09:00', end: '18:00' },
    { day: 5, enabled: true,  start: '09:00', end: '18:00' },
    { day: 6, enabled: true,  start: '09:00', end: '14:00' },
  ],
};

/** @param {Date} date */
export function getDayConfig(date) {
  return BOOKING_CONFIG.workingDays[date.getDay()];
}

/** @param {Date} date */
export function isWorkingDay(date) {
  return getDayConfig(date)?.enabled ?? false;
}

/**
 * Returns true if the date is selectable: not past, within maxAdvanceDays, and a working day.
 * @param {Date} date
 */
export function isBookableDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d < today) return false;
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_CONFIG.maxAdvanceDays);
  if (d > maxDate) return false;
  return isWorkingDay(d);
}

/**
 * Generates time slot strings (HH:MM) for the given date based on working hours.
 * Returns [] for non-working days.
 * @param {Date} date
 * @returns {string[]}
 */
export function buildSlotsForDate(date) {
  const config = getDayConfig(date);
  if (!config?.enabled) return [];

  const [startH, startM] = config.start.split(':').map(Number);
  const [endH, endM] = config.end.split(':').map(Number);
  const endTotal = endH * 60 + endM;

  const slots = [];
  let total = startH * 60 + startM;
  while (total < endTotal) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    total += BOOKING_CONFIG.slotMinutes;
  }
  return slots;
}

/**
 * Formats a duration in minutes to a readable string.
 * @param {number} minutes
 */
export function formatDuration(minutes) {
  if (!minutes) return '—';
  const m = Number(minutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h} h ${rem} min` : `${h} h`;
}
