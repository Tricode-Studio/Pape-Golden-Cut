import ScrollReveal from '../ui/ScrollReveal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useCMSEntries } from '../../hooks/useCMSEntries';
import { formatDuration } from '../../lib/bookingConfig';

const ICONS = {
  scissors: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="18" cy="18" r="8"/><circle cx="18" cy="46" r="8"/>
      <line x1="24" y1="22" x2="50" y2="48"/><line x1="24" y1="42" x2="50" y2="16"/>
      <line x1="28" y1="32" x2="56" y2="32" strokeDasharray="3 3"/>
    </svg>
  ),
  razor: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="20" y="10" width="24" height="44" rx="4"/>
      <line x1="20" y1="22" x2="44" y2="22"/>
      <line x1="20" y1="42" x2="44" y2="42"/>
      <line x1="32" y1="10" x2="32" y2="6"/>
      <circle cx="32" cy="32" r="4"/>
    </svg>
  ),
  combo: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="14" cy="14" r="6"/><circle cx="14" cy="36" r="6"/>
      <line x1="19" y1="18" x2="38" y2="37"/><line x1="19" y1="32" x2="38" y2="13"/>
      <rect x="40" y="8" width="16" height="34" rx="3"/>
      <line x1="40" y1="18" x2="56" y2="18"/>
      <line x1="40" y1="32" x2="56" y2="32"/>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M32 8 C16 12 10 28 12 48 C28 46 44 40 52 24 C48 12 40 8 32 8Z"/>
      <line x1="32" y1="48" x2="32" y2="56"/>
      <line x1="24" y1="32" x2="40" y2="28" strokeDasharray="3 3"/>
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

function ServiceCard({ service }) {
  const f = service.fields ?? service;
  return (
    <div className="service-card">
      <div className="icon">{ICONS[iconFromName(f.name)]}</div>
      <h3>{f.name}</h3>
      <div className="duration">{formatDuration(f.durationminutes)}</div>
      {f.description && <p className="desc">{f.description}</p>}
      <div className="price">
        Desde
        <strong>$ {Number(f.price).toLocaleString('es-UY')}</strong>
      </div>
    </div>
  );
}

export default function Services() {
  const { entries, loading } = useCMSEntries('barber-services');

  return (
    <section id="servicios">
      <div className="container">
        <ScrollReveal>
          <div className="section-head">
            <div className="kicker">
              <span className="line" />
              Nuestros servicios
              <span className="line" />
            </div>
            <h2>Cada corte, <span className="script">una firma</span></h2>
            <p className="desc">
              Servicios diseñados para realzar tu presencia, con técnica, dedicación y productos de calidad.
            </p>
          </div>
        </ScrollReveal>

        {loading && <LoadingSpinner message="Cargando servicios…" />}

        {!loading && entries.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5, padding: '2rem 0' }}>
            Servicios próximamente disponibles.
          </p>
        )}

        {!loading && entries.length > 0 && (
          <div className="services-grid">
            {entries.map((s, i) => (
              <ScrollReveal key={s.id ?? i}>
                <ServiceCard service={s} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
