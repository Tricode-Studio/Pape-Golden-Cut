import ScrollReveal from '../ui/ScrollReveal';

function ToolsIllustration() {
  return (
    <svg className="tools" viewBox="0 0 320 400" fill="none" stroke="currentColor" strokeWidth="1">
      {/* Straight razor */}
      <rect x="60" y="40" width="200" height="70" rx="8"/>
      <rect x="60" y="40" width="120" height="70" rx="8" opacity="0.4"/>
      <line x1="180" y1="40" x2="180" y2="110" strokeWidth="0.5"/>
      <rect x="75" y="52" width="90" height="46" rx="4" opacity="0.3"/>
      {/* Scissors */}
      <circle cx="100" cy="190" r="20"/><circle cx="100" cy="260" r="20"/>
      <line x1="116" y1="200" x2="220" y2="290"/><line x1="116" y1="250" x2="220" y2="160"/>
      <line x1="140" y1="225" x2="260" y2="225" strokeDasharray="6 4" opacity="0.5"/>
      {/* Comb */}
      <rect x="60" y="330" width="200" height="28" rx="4"/>
      <line x1="75" y1="330" x2="75" y2="358"/><line x1="90" y1="330" x2="90" y2="358"/>
      <line x1="105" y1="330" x2="105" y2="358"/><line x1="120" y1="330" x2="120" y2="358"/>
      <line x1="135" y1="330" x2="135" y2="358"/><line x1="150" y1="330" x2="150" y2="358"/>
      <line x1="165" y1="330" x2="165" y2="358"/><line x1="180" y1="330" x2="180" y2="358"/>
      <line x1="195" y1="330" x2="195" y2="358"/><line x1="210" y1="330" x2="210" y2="358"/>
      <line x1="225" y1="330" x2="225" y2="358"/>
      {/* Decorative lines */}
      <line x1="60" y1="135" x2="260" y2="135" strokeWidth="0.5" opacity="0.3"/>
      <line x1="60" y1="310" x2="260" y2="310" strokeWidth="0.5" opacity="0.3"/>
    </svg>
  );
}

export default function Story() {
  return (
    <section id="historia">
      <div className="container">
        <div className="story-grid">
          <ScrollReveal>
            <div className="story-image">
              <div className="pic">
                <ToolsIllustration />
              </div>
              <div className="frame-deco" />
              <div className="stamp">
                <div className="since">Desde</div>
                <div className="yr">2017</div>
                <div className="lbl">Trinidad</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="story-text">
              <div className="kicker">
                <span className="line" />
                Nuestra historia
              </div>
              <h2>
                Más que un corte,
                <br />
                <span className="script">un oficio</span>
              </h2>
              <p>
                PAPE Golden Cut nació en 2017 con una visión clara: devolver el valor de la barbería clásica al corazón de Trinidad. Desde el primer día, cada cliente que entra recibe atención personalizada, técnica refinada y un ambiente que invita a relajarse.
              </p>
              <p>
                Más de ocho años de oficio nos enseñaron que un buen corte no es solo una cuestión de tijera y navaja — es escuchar, entender el estilo de cada persona, y ejecutarlo con precisión.
              </p>
              <p>
                Hoy somos el punto de referencia de la barbería en Flores, atendiendo a caballeros, damas y niños con el mismo compromiso de calidad que nos dio origen.
              </p>
              <div className="signature">
                Pablo Pereira
                <small>Fundador · PAPE Golden Cut</small>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
