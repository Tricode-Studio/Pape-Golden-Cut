function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toTimeLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function parseHm(value) {
  const [h, m] = String(value || '00:00').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

function isInBlockedRange(dateKey, blockedRanges) {
  return blockedRanges.some((range) => dateKey >= range.from && dateKey <= range.to);
}

function createDateFromMinutes(baseDate, totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}

export function buildAvailabilityByDay({
  year,
  month,
  booking,
  busy,
  serviceDurationMinutes,
}) {
  const byDate = {};
  const reasons = {};

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + (booking.maxAdvanceDays ?? 30));

  const offDates = new Set(booking.offDates ?? []);
  const blockedRanges = Array.isArray(booking.blockedRanges) ? booking.blockedRanges : [];
  const workingDays = Array.isArray(booking.workingDays) ? booking.workingDays : [];
  const durationMinutes = Math.max(5, Number(serviceDurationMinutes) || Number(booking.slotMinutes) || 30);
  const slotStepMinutes = Math.max(5, Number(booking.slotMinutes) || 30);
  const busyIntervals = (busy ?? []).map((entry) => ({
    start: new Date(entry.startsAt),
    end: new Date(entry.endsAt),
  }));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);

    const dateKey = toDateKey(date);
    if (date < today) {
      reasons[dateKey] = 'Fecha pasada';
      byDate[dateKey] = [];
      continue;
    }

    if (date > maxDate) {
      reasons[dateKey] = `Reservas hasta ${booking.maxAdvanceDays ?? 30} días de anticipación`;
      byDate[dateKey] = [];
      continue;
    }

    const dayConfig = workingDays.find((item) => item.day === date.getDay());
    if (!dayConfig?.enabled) {
      reasons[dateKey] = 'Cerrado ese día';
      byDate[dateKey] = [];
      continue;
    }

    if (offDates.has(dateKey)) {
      reasons[dateKey] = 'Día no disponible';
      byDate[dateKey] = [];
      continue;
    }

    if (isInBlockedRange(dateKey, blockedRanges)) {
      reasons[dateKey] = 'Fecha bloqueada';
      byDate[dateKey] = [];
      continue;
    }

    const startMinutes = parseHm(dayConfig.start);
    const endMinutes = parseHm(dayConfig.end);
    const latestStart = endMinutes - durationMinutes;
    const slots = [];

    for (let cursor = startMinutes; cursor <= latestStart; cursor += slotStepMinutes) {
      const startAt = createDateFromMinutes(date, cursor);
      const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);
      if (startAt < now) continue;

      const hasConflict = busyIntervals.some((interval) =>
        overlaps(startAt, endAt, interval.start, interval.end),
      );
      if (!hasConflict) {
        slots.push(toTimeLabel(cursor));
      }
    }

    byDate[dateKey] = slots;
    if (slots.length === 0) {
      reasons[dateKey] = 'Sin horarios disponibles';
    }
  }

  return { byDate, reasons };
}

export function dateToKey(date) {
  return toDateKey(date);
}

export function toIsoFromDateAndTime(date, timeLabel) {
  const [hours, minutes] = String(timeLabel || '00:00').split(':').map(Number);
  const value = new Date(date);
  value.setHours(hours || 0, minutes || 0, 0, 0);
  return value.toISOString();
}

