import { useEffect, useState } from 'react';
import { getReservationAvailability } from '../api/cms';
import { buildAvailabilityByDay } from '../lib/reservationAvailability';

const DEFAULT_BOOKING = {
  slotMinutes: 30,
  maxAdvanceDays: 30,
  timezone: 'America/Montevideo',
  workingDays: [
    { day: 0, enabled: false, start: '09:00', end: '13:00' },
    { day: 1, enabled: true, start: '09:00', end: '18:00' },
    { day: 2, enabled: true, start: '09:00', end: '18:00' },
    { day: 3, enabled: true, start: '09:00', end: '18:00' },
    { day: 4, enabled: true, start: '09:00', end: '18:00' },
    { day: 5, enabled: true, start: '09:00', end: '18:00' },
    { day: 6, enabled: true, start: '09:00', end: '14:00' },
  ],
  offDates: [],
  blockedRanges: [],
};

function toDateKey(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useReservationAvailability({ month, year, serviceDurationMinutes }) {
  const [booking, setBooking] = useState(DEFAULT_BOOKING);
  const [byDate, setByDate] = useState({});
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const from = toDateKey(new Date(year, month, 1));
    const to = toDateKey(new Date(year, month + 1, 0));

    setLoading(true);
    setError(null);
    getReservationAvailability(from, to)
      .then((response) => {
        if (cancelled) return;
        const nextBooking = response?.booking ?? DEFAULT_BOOKING;
        const busy = Array.isArray(response?.busy) ? response.busy : [];
        const computed = buildAvailabilityByDay({
          year,
          month,
          booking: nextBooking,
          busy,
          serviceDurationMinutes,
        });
        setBooking(nextBooking);
        setByDate(computed.byDate);
        setReasons(computed.reasons);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        const fallback = buildAvailabilityByDay({
          year,
          month,
          booking: DEFAULT_BOOKING,
          busy: [],
          serviceDurationMinutes,
        });
        setBooking(DEFAULT_BOOKING);
        setByDate(fallback.byDate);
        setReasons(fallback.reasons);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [month, year, serviceDurationMinutes]);

  return { booking, byDate, reasons, loading, error };
}

