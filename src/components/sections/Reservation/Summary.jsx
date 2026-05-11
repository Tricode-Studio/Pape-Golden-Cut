import { DAYS, MONTHS, MONTHS_SHORT } from './Calendar';

function Row({ icon, label, value, empty }) {
  return (
    <div className="summary-row">
      <div className="ix">{icon}</div>
      <div className="data">
        <div className="lbl">{label}</div>
        <div className={`val${empty ? ' empty' : ''}`}>{value}</div>
      </div>
    </div>
  );
}

export default function Summary({ state }) {
  const dateStr = state.date
    ? `${DAYS[state.date.getDay()]} ${state.date.getDate()} ${MONTHS_SHORT[state.date.getMonth()]} ${state.date.getFullYear()}`
    : null;

  return (
    <div className="reserva-summary">
      <h4>Resumen de reserva</h4>

      <Row
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z"/><path d="M3 20c0-3.3 4-6 9-6s9 2.7 9 6"/></svg>}
        label="Servicio"
        value={state.service}
        empty={false}
      />
      <Row
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        label="Fecha"
        value={dateStr ?? 'Seleccioná el día'}
        empty={!dateStr}
      />
      <Row
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>}
        label="Hora"
        value={state.time ?? 'Seleccioná la hora'}
        empty={!state.time}
      />
      <Row
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><line x1="12" y1="6" x2="12" y2="13"/><line x1="12" y1="13" x2="16" y2="13"/></svg>}
        label="Duración"
        value={state.duration}
        empty={false}
      />

      <div className="summary-total">
        <span className="lbl">Total estimado</span>
        <span className="amt">$ {Number(state.price).toLocaleString('es-UY')}</span>
      </div>

      <div className="summary-help">
        <div className="wa-ic" style={{ background: 'var(--gold)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2 L4 6 V12 Q4 18 12 22 Q20 18 20 12 V6 Z"/>
            <path d="M9 12 L11 14 L15 10"/>
          </svg>
        </div>
        <span>Una vez enviada, nos comunicaremos para confirmar el turno.</span>
      </div>
    </div>
  );
}
