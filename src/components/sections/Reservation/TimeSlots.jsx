export default function TimeSlots({ selectedDate, selectedTime, onSelect, slots = [], loading = false }) {
  if (!selectedDate) {
    return <p className="slots-hint">Seleccioná primero una fecha.</p>;
  }

  if (loading) {
    return <p className="slots-hint">Cargando horarios disponibles…</p>;
  }

  if (slots.length === 0) {
    return <p className="slots-hint">No hay disponibilidad para ese día.</p>;
  }

  return (
    <div className="time-grid">
      {slots.map(s => {
        const isActive = selectedTime === s;
        return (
          <button
            key={s}
            type="button"
            className={`time-slot${isActive ? ' active' : ''}`}
            onClick={() => onSelect(s)}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
