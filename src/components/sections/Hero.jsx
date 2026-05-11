import ScrollReveal from '../ui/ScrollReveal';
import { useLandingConfig } from '../../hooks/useLandingConfig';

const DEFAULTS = {
  eyebrow: 'Barbería · Trinidad, Flores',
  h1Line1: 'Bienvenido a',
  h1Script: 'PAPE',
  h1Line2: 'GOLDEN',
  h1Ital: 'CUT',
  lead: 'Enfocado en la exclusividad de cada persona con precisión y estilo en cada detalle.',
  stats: [
    { num: '10 años', lbl: 'De experiencia' },
    { num: '★ 5.0', lbl: 'Reputación local' },
  ],
};

export default function Hero() {
  const { data } = useLandingConfig();
  const hero  = data?.hero ?? DEFAULTS;
  const stats = hero.stats ?? DEFAULTS.stats;

  return (
    <section className="hero" id="top">
      <div className="hero-bg" />
      <div className="container">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-eyebrow reveal d1">
              <span className="line" />
              {hero.eyebrow ?? DEFAULTS.eyebrow}
            </div>
            <h1 className="reveal d2">
              {hero.h1Line1 ?? DEFAULTS.h1Line1}
              <span className="script">{hero.h1Script ?? DEFAULTS.h1Script}</span>
              <span className="ital">
                {hero.h1Line2 ?? DEFAULTS.h1Line2}{' '}
                {hero.h1Ital ?? DEFAULTS.h1Ital}
              </span>
            </h1>
            <p className="lead reveal d3">
              {hero.lead ?? DEFAULTS.lead}
            </p>
            <div className="hero-cta reveal d4">
              <a href="#reserva" className="btn btn-solid">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Reservar Hora
              </a>
              <a href="#servicios" className="btn btn-ghost">Ver Servicios</a>
            </div>
            <div className="hero-meta reveal d5">
              {stats.map((s, i) => (
                <div className="item" key={i}>
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual reveal d3">
            <div className="frame" />
            <div className="photo">
              <div className="corner tl" />
              <div className="corner tr" />
              <div className="corner bl" />
              <div className="corner br" />
              <div className="photo-inner">
                <svg className="orn" viewBox="0 0 80 12" fill="none">
                  <line x1="0" y1="6" x2="28" y2="6" stroke="currentColor" strokeWidth="0.5"/>
                  <circle cx="40" cy="6" r="4" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                  <circle cx="40" cy="6" r="1.5" fill="currentColor"/>
                  <line x1="52" y1="6" x2="80" y2="6" stroke="currentColor" strokeWidth="0.5"/>
                </svg>
                <svg className="hero-logo" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="110" y="72" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="88" fontWeight="600" fill="#c9a961" letterSpacing="8">PAPE</text>
                  <line x1="10" y1="88" x2="210" y2="88" stroke="#c9a961" strokeWidth="0.5" opacity="0.5"/>
                  <text x="110" y="108" textAnchor="middle" fontFamily="'Italianno', cursive" fontSize="28" fill="#f3ecd9" letterSpacing="2">Golden Cut</text>
                </svg>
                <div className="hero-tag">
                  <span className="ln" />
                  Barbería de oficio
                  <span className="ln" />
                </div>
              </div>
            </div>
            <div className="badge">
              <div className="yr">2017</div>
              <div className="txt">Estbd.</div>
            </div>
            <div className="ribbon">
              <div className="label">Ubicación</div>
              <div className="value">Trinidad — Flores</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
