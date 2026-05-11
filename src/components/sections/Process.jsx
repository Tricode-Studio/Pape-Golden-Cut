import ScrollReveal from '../ui/ScrollReveal';

const STEPS = [
  {
    n: 'i',
    title: 'Elegí el servicio',
    desc: 'Seleccioná entre corte, barba, combo o tratamiento según lo que necesitás.',
  },
  {
    n: 'ii',
    title: 'Día y hora',
    desc: 'Elegí el día y horario disponible que mejor se adapte a tu rutina.',
  },
  {
    n: 'iii',
    title: 'Confirmación',
    desc: 'Confirmá vía WhatsApp y listo. Te esperamos en el local.',
  },
];

export default function Process() {
  return (
    <section className="steps" id="proceso">
      <div className="container">
        <ScrollReveal>
          <div className="section-head">
            <div className="kicker">
              <span className="line" />
              Así funciona
              <span className="line" />
            </div>
            <h2>Reservá en <span className="script">tres pasos</span></h2>
          </div>
        </ScrollReveal>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <ScrollReveal key={i} className={`step`}>
              <div className="num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
