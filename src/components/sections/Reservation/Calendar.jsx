import { isBookableDate, isWorkingDay, BOOKING_CONFIG } from '../../../lib/bookingConfig';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MONTHS_SHORT = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DAYS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const DOW = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

export { MONTHS, MONTHS_SHORT, DAYS };

function disabledTitle(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d < today) return 'Fecha pasada';
  const max = new Date(today);
  max.setDate(max.getDate() + BOOKING_CONFIG.maxAdvanceDays);
  if (d > max) return `Reservas hasta ${BOOKING_CONFIG.maxAdvanceDays} días de anticipación`;
  if (!isWorkingDay(d)) return 'Cerrado ese día';
  return undefined;
}

export default function Calendar({ month, year, selectedDate, onSelect, onPrev, onNext }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  let startWeekday = firstDay.getDay() - 1;
  if (startWeekday < 0) startWeekday = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ empty: true, key: `e${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    date.setHours(0, 0, 0, 0);
    const bookable = isBookableDate(date);
    const isToday = date.getTime() === today.getTime();
    const isActive = selectedDate && date.getTime() === selectedDate.getTime();
    cells.push({ d, date, disabled: !bookable, isToday, isActive, key: `d${d}` });
  }

  return (
    <div className="cal-wrap">
      <div className="calendar">
        <div className="cal-head">
          <button className="cal-nav" onClick={onPrev} aria-label="Mes anterior">‹</button>
          <span className="month">{MONTHS[month]} {year}</span>
          <button className="cal-nav" onClick={onNext} aria-label="Mes siguiente">›</button>
        </div>
        <div className="cal-grid">
          {DOW.map(d => <div className="dow" key={d}>{d}</div>)}
          {cells.map(cell => {
            if (cell.empty) return <div className="day empty" key={cell.key} />;
            let cls = 'day';
            if (cell.disabled) cls += ' disabled';
            if (cell.isToday) cls += ' today';
            if (cell.isActive) cls += ' active';
            return (
              <div
                key={cell.key}
                className={cls}
                onClick={cell.disabled ? undefined : () => onSelect(cell.date)}
                title={cell.disabled ? disabledTitle(cell.date) : undefined}
              >
                {cell.d}
              </div>
            );
          })}
        </div>
      </div>

      <div className="selected-date">
        <div className="lbl">Fecha seleccionada</div>
        {selectedDate ? (
          <>
            <div className="day-num">{selectedDate.getDate()}</div>
            <div className="day-name">{DAYS[selectedDate.getDay()]}</div>
            <div className="month-year">{MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}</div>
          </>
        ) : (
          <>
            <div className="day-num" style={{ color: 'var(--bg-3)' }}>—</div>
            <div className="day-name" style={{ color: 'var(--bg-3)' }}>—</div>
            <div className="month-year" style={{ color: 'var(--bg-3)' }}>Seleccioná un día</div>
          </>
        )}
      </div>
    </div>
  );
}
