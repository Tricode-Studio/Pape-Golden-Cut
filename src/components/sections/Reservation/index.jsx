import { useEffect, useMemo, useRef, useState } from 'react';
import ScrollReveal from '../../ui/ScrollReveal';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Calendar, { DAYS, MONTHS } from './Calendar';
import TimeSlots from './TimeSlots';
import Summary from './Summary';
import { useCMSEntries } from '../../../hooks/useCMSEntries';
import { createReservation, previewReservation } from '../../../api/cms';
import { useReservationAvailability } from '../../../hooks/useReservationAvailability';
import { formatDuration } from '../../../lib/bookingConfig';
import { dateToKey, toIsoFromDateAndTime } from '../../../lib/reservationAvailability';


const SERVICE_ICONS = {
  scissors: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="ico">
      <circle cx="10" cy="10" r="5"/><circle cx="10" cy="30" r="5"/>
      <line x1="14" y1="13" x2="32" y2="32"/><line x1="14" y1="27" x2="32" y2="8"/>
    </svg>
  ),
  razor: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="ico">
      <rect x="12" y="6" width="16" height="28" rx="3"/>
      <line x1="12" y1="13" x2="28" y2="13"/>
      <line x1="12" y1="27" x2="28" y2="27"/>
      <circle cx="20" cy="20" r="2.5"/>
    </svg>
  ),
  combo: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="ico">
      <circle cx="9" cy="9" r="4"/><circle cx="9" cy="23" r="4"/>
      <line x1="12" y1="11" x2="24" y2="25"/><line x1="12" y1="21" x2="24" y2="7"/>
      <rect x="26" y="6" width="9" height="22" rx="2"/>
      <line x1="26" y1="13" x2="35" y2="13"/>
      <line x1="26" y1="21" x2="35" y2="21"/>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="ico">
      <path d="M20 4 C10 7 6 17 8 32 C18 30 28 25 33 14 C30 7 26 4 20 4Z"/>
      <line x1="20" y1="32" x2="20" y2="37"/>
    </svg>
  ),
};

function iconFromName(name = '') {
  const n = name.toLowerCase();
  if (n.includes('barba') || n.includes('beard') || n.includes('afeit')) return 'razor';
  if (n.includes('combo') || n.includes('completo') || n.includes('pack')) return 'combo';
  if (n.includes('trat') || n.includes('hidrat') || n.includes('capilar')) return 'leaf';
  return 'scissors';
}

function ConfirmationPanel({ snapshot, onReset }) {
  const dateStr = snapshot.date
    ? `${DAYS[snapshot.date.getDay()]} ${snapshot.date.getDate()} de ${MONTHS[snapshot.date.getMonth()].toLowerCase()} ${snapshot.date.getFullYear()}`
    : '—';

  return (
    <div className="reserva-confirmed">
      <div className="confirmed-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2 L4 6 V12 Q4 18 12 22 Q20 18 20 12 V6 Z"/>
          <path d="M9 12 L11 14 L15 10"/>
        </svg>
      </div>
      <h3>¡Reserva registrada!</h3>
      <p>Nos pondremos en contacto para confirmar tu turno.</p>
      <div className="confirmed-details">
        <div className="confirmed-row">
          <span className="confirmed-lbl">Servicio</span>
          <span className="confirmed-val">{snapshot.service} · {snapshot.duration}</span>
        </div>
        <div className="confirmed-row">
          <span className="confirmed-lbl">Fecha</span>
          <span className="confirmed-val" style={{ textTransform: 'capitalize' }}>{dateStr}</span>
        </div>
        <div className="confirmed-row">
          <span className="confirmed-lbl">Hora</span>
          <span className="confirmed-val">{snapshot.time}</span>
        </div>
        <div className="confirmed-row">
          <span className="confirmed-lbl">Nombre</span>
          <span className="confirmed-val">{snapshot.name}</span>
        </div>
        <div className="confirmed-row">
          <span className="confirmed-lbl">Teléfono</span>
          <span className="confirmed-val">{snapshot.phone}</span>
        </div>
        <div className="confirmed-row">
          <span className="confirmed-lbl">Total estimado</span>
          <span className="confirmed-val confirmed-price">
            $ {Number(snapshot.price).toLocaleString('es-UY')}
          </span>
        </div>
      </div>
      <button type="button" className="btn" onClick={onReset} style={{ marginTop: 32 }}>
        Nueva reserva
      </button>
    </div>
  );
}

function buildInitialBooking(service) {
  const now = new Date();
  const f = service?.fields ?? service ?? {};
  return {
    serviceId: service?.id ?? null,
    service: f.name ?? null,
    duration: f.durationminutes ? formatDuration(f.durationminutes) : null,
    price: f.price ? Number(f.price) : null,
    date: null,
    time: null,
    calMonth: now.getMonth(),
    calYear: now.getFullYear(),
  };
}

const WA_NUMBER = '59898856783';

function PersonalizadoPanel() {
  const msg = encodeURIComponent('Hola PAPE! Quiero consultar por un servicio personalizado.');
  return (
    <div className="personalizado-panel">
      <div className="personalizado-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </div>
      <h3>Servicio personalizado</h3>
      <p>Este servicio requiere una consulta previa. Contactanos por WhatsApp para definir los detalles de tu experiencia junto a PAPE.</p>
      <a
        className="btn btn-solid btn-wa"
        href={`https://wa.me/${WA_NUMBER}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Consultar por WhatsApp
      </a>
    </div>
  );
}

export default function Reservation({ showToast }) {
  const { entries: cmsServices, loading: svcLoading } = useCMSEntries('barber-services');

  const bookableServices = cmsServices.filter(s => (s.fields ?? s).allowonlinebooking !== false);
  const services = bookableServices.length > 0 ? bookableServices : cmsServices;

  const firstService = services[0];
  const [booking, setBooking] = useState(() => buildInitialBooking(firstService));
  const [confirmed, setConfirmed] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const notesRef = useRef(null);
  const autoDateRef = useRef(false);

  const selectedService = useMemo(
    () => services.find((service) => service.id === booking.serviceId) ?? services[0] ?? null,
    [booking.serviceId, services],
  );
  const serviceDurationMinutes = Number((selectedService?.fields ?? selectedService ?? {}).durationminutes) || 30;
  const {
    booking: bookingPolicy,
    byDate: availabilityByDate,
    reasons: availabilityReasons,
    loading: availabilityLoading,
    error: availabilityError,
  } = useReservationAvailability({
    month: booking.calMonth,
    year: booking.calYear,
    serviceDurationMinutes,
  });

  const selectedDateKey = booking.date ? dateToKey(booking.date) : null;
  const availableTimes = selectedDateKey ? (availabilityByDate[selectedDateKey] ?? []) : [];

  useEffect(() => {
    if (!booking.serviceId && services[0]) {
      setBooking(buildInitialBooking(services[0]));
    }
  }, [booking.serviceId, services]);

  useEffect(() => {
    if (!booking.time) return;
    if (!availableTimes.includes(booking.time)) {
      setBooking((prev) => ({ ...prev, time: null }));
    }
  }, [availableTimes, booking.time]);

  // Auto-seleccionar el primer día disponible a partir de hoy
  useEffect(() => {
    if (availabilityLoading || autoDateRef.current || booking.date) return;
    if (booking.service?.trim().toLowerCase() === 'personalizado') return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 60; i++) {
      const candidate = new Date(today);
      candidate.setDate(today.getDate() + i);
      const key = dateToKey(candidate);
      if (availabilityByDate[key]?.length > 0) {
        autoDateRef.current = true;
        setBooking(b => ({
          ...b,
          date: candidate,
          time: null,
          calMonth: candidate.getMonth(),
          calYear: candidate.getFullYear(),
        }));
        return;
      }
    }
  }, [availabilityLoading, availabilityByDate]);

  function selectService(s) {
    const f = s.fields ?? s;
    setBooking(b => ({
      ...b,
      serviceId: s.id,
      service: f.name,
      duration: formatDuration(f.durationminutes),
      price: Number(f.price),
      time: null,
    }));
  }

  function selectDate(date) { setBooking(b => ({ ...b, date, time: null })); }
  function selectTime(time) { setBooking(b => ({ ...b, time })); }

  function prevMonth() {
    setBooking(b => {
      let m = b.calMonth - 1, y = b.calYear;
      if (m < 0) { m = 11; y--; }
      return { ...b, calMonth: m, calYear: y };
    });
  }

  function nextMonth() {
    setBooking(b => {
      let m = b.calMonth + 1, y = b.calYear;
      if (m > 11) { m = 0; y++; }
      return { ...b, calMonth: m, calYear: y };
    });
  }

  async function handleConfirm() {
    const name = nameRef.current?.value.trim();
    const phone = phoneRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const notes = notesRef.current?.value.trim();

    if (!booking.date) { showToast('Por favor seleccioná un día', true); return; }
    if (!booking.time) { showToast('Por favor seleccioná una hora', true); return; }
    if (!name) { showToast('Ingresá tu nombre', true); nameRef.current?.focus(); return; }
    if (!phone) { showToast('Ingresá tu teléfono', true); phoneRef.current?.focus(); return; }
    if (!email) { showToast('Ingresá tu email', true); emailRef.current?.focus(); return; }
    if (!availableTimes.includes(booking.time)) { showToast('Ese horario ya no está disponible', true); return; }

    const startsAt = toIsoFromDateAndTime(booking.date, booking.time);
    const endsAt = new Date(new Date(startsAt).getTime() + serviceDurationMinutes * 60000).toISOString();
    const snapshot = { ...booking, name, phone, email, notes };
    setSubmitting(true);
    try {
      const preview = await previewReservation({
        serviceName: snapshot.service,
        startsAt,
        endsAt,
        recurrenceFrequency: 'NONE',
      });
      if (!preview?.canCreate) {
        showToast('Ese horario ya no está disponible. Elegí otro.', true);
        return;
      }

      await createReservation({
        serviceName: snapshot.service,
        startsAt,
        endsAt,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        notes: notes || undefined,
      });
      setConfirmed(snapshot);
      showToast('¡Reserva registrada correctamente!');
    } catch (err) {
      console.error('[CMS] reservation create failed:', err.message);
      showToast('No se pudo registrar la reserva. Intentá nuevamente.', true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setConfirmed(null);
    setBooking(buildInitialBooking(services[0]));
  }

  const isPersonalizado = booking.service?.trim().toLowerCase() === 'personalizado';

  return (
    <section className="reserva" id="reserva">
      <div className="container">
        <ScrollReveal>
          <div className="section-head">
            <div className="kicker">
              <span className="line" />
              Tu turno
              <span className="line" />
            </div>
            <h2>Reservá tu <span className="script">hora</span></h2>
            <p className="desc">Completá el formulario y nos contactaremos para confirmar tu turno.</p>
          </div>
        </ScrollReveal>

        {!svcLoading && services.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem 0' }}>
            Reservas online próximamente disponibles.
          </p>
        )}

        {confirmed ? (
          <ConfirmationPanel snapshot={confirmed} onReset={handleReset} />
        ) : services.length > 0 ? (
          <div className="reserva-grid">
            <div className="reserva-main">

              {/* STEP 1: SERVICE */}
              <div className="step-block">
                <div className="step-title">
                  <div className="ix">i</div>
                  <h3>Elegí el servicio</h3>
                </div>
                {svcLoading ? (
                  <LoadingSpinner message="Cargando servicios…" />
                ) : (
                  <div className="service-tiles">
                    {services.map(s => {
                      const f = s.fields ?? s;
                      const isActive = booking.serviceId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          className={`service-tile${isActive ? ' active' : ''}`}
                          onClick={() => selectService(s)}
                        >
                          {SERVICE_ICONS[iconFromName(f.name)]}
                          <div className="name">{f.name}</div>
                          <div className="meta">{formatDuration(f.durationminutes)}</div>
                          <div className="price">$ {Number(f.price).toLocaleString('es-UY')}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {isPersonalizado ? (
                <PersonalizadoPanel />
              ) : (
                <>
                  {/* STEP 2: CALENDAR */}
                  <div className="step-block">
                    <div className="step-title">
                      <div className="ix">ii</div>
                      <h3>Elegí la fecha</h3>
                    </div>
                    <Calendar
                      month={booking.calMonth}
                      year={booking.calYear}
                      selectedDate={booking.date}
                      onSelect={selectDate}
                      onPrev={prevMonth}
                      onNext={nextMonth}
                      availabilityByDate={availabilityByDate}
                      reasonsByDate={availabilityReasons}
                    />
                    {availabilityError ? (
                      <p className="slots-hint" style={{ marginTop: 12 }}>
                        No pudimos sincronizar disponibilidad en tiempo real. Mostrando disponibilidad estimada.
                      </p>
                    ) : null}
                  </div>

                  {/* STEP 3: TIME */}
                  <div className="step-block">
                    <div className="step-title">
                      <div className="ix">iii</div>
                      <h3>Elegí la hora</h3>
                    </div>
                    <TimeSlots
                      selectedDate={booking.date}
                      selectedTime={booking.time}
                      onSelect={selectTime}
                      slots={availableTimes}
                      loading={availabilityLoading}
                    />
                  </div>

                  {/* STEP 4: FORM */}
                  <div className="step-block">
                    <div className="step-title">
                      <div className="ix">iv</div>
                      <h3>Tus datos</h3>
                    </div>
                    <div className="form-grid">
                      <div className="field">
                        <label htmlFor="custName">Nombre completo</label>
                        <input id="custName" type="text" ref={nameRef} placeholder="Juan García" autoComplete="name" />
                      </div>
                      <div className="field">
                        <label htmlFor="custPhone">Teléfono</label>
                        <input id="custPhone" type="tel" ref={phoneRef} placeholder="099 000 000" autoComplete="tel" />
                      </div>
                    </div>
                    <div className="form-grid full" style={{ marginTop: 16 }}>
                      <div className="field">
                        <label htmlFor="custEmail">Email</label>
                        <input id="custEmail" type="email" ref={emailRef} placeholder="juan@email.com" autoComplete="email" />
                      </div>
                    </div>
                    <div className="form-grid full" style={{ marginTop: 16 }}>
                      <div className="field">
                        <label htmlFor="custNotes">Notas adicionales (opcional)</label>
                        <textarea id="custNotes" ref={notesRef} placeholder="Ej: corte navaja en los costados, barba corta…" />
                      </div>
                    </div>
                  </div>

                  <div className="confirm-row">
                    <div className="terms">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2 L4 6 V12 Q4 18 12 22 Q20 18 20 12 V6 Z"/>
                        <path d="M9 12 L11 14 L15 10"/>
                      </svg>
                      Horarios según agenda real del CMS ({bookingPolicy.timezone}).
                    </div>
                    <button type="button" className="btn btn-solid" onClick={handleConfirm} disabled={submitting}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6 L9 17 L4 12"/>
                      </svg>
                      {submitting ? 'Enviando…' : 'Confirmá tu reserva'}
                    </button>
                  </div>
                </>
              )}
            </div>

            <Summary state={booking} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
