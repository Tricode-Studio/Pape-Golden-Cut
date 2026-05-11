import { useState, useRef } from 'react';
import ScrollReveal from '../../ui/ScrollReveal';
import LoadingSpinner from '../../ui/LoadingSpinner';
import Calendar, { DAYS, MONTHS } from './Calendar';
import TimeSlots from './TimeSlots';
import Summary from './Summary';
import { useCMSEntries } from '../../../hooks/useCMSEntries';
import { submitPresupuesto } from '../../../api/cms';
import { formatDuration } from '../../../lib/bookingConfig';


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
  const notesRef = useRef(null);

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
    const notes = notesRef.current?.value.trim();

    if (!booking.date) { showToast('Por favor seleccioná un día', true); return; }
    if (!booking.time) { showToast('Por favor seleccioná una hora', true); return; }
    if (!name) { showToast('Ingresá tu nombre', true); nameRef.current?.focus(); return; }
    if (!phone) { showToast('Ingresá tu teléfono', true); phoneRef.current?.focus(); return; }

    const snapshot = { ...booking, name, phone, notes };
    setSubmitting(true);
    try {
      await submitPresupuesto({
        name,
        phone,
        service: snapshot.service,
        requestedDate: snapshot.date.toISOString().slice(0, 10),
        requestedTime: snapshot.time,
        notes: notes || undefined,
      });
    } catch (err) {
      console.error('[CMS] presupuestos POST failed:', err.message);
    } finally {
      setSubmitting(false);
      setConfirmed(snapshot);
      showToast('¡Reserva registrada correctamente!');
    }
  }

  function handleReset() {
    setConfirmed(null);
    setBooking(buildInitialBooking(services[0]));
  }

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
                />
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
                  Nos comunicaremos para confirmar el turno.
                </div>
                <button type="button" className="btn btn-solid" onClick={handleConfirm} disabled={submitting}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 L9 17 L4 12"/>
                  </svg>
                  {submitting ? 'Enviando…' : 'Confirmá tu reserva'}
                </button>
              </div>
            </div>

            <Summary state={booking} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
