import ScrollReveal from '../ui/ScrollReveal';

const PANES = [
  {
    cls: 'caballeros',
    roman: 'I · Caballeros',
    title: 'Caballeros',
    desc: 'Corte clásico o moderno, barba impecable. El estándar PAPE para el hombre que cuida su imagen.',
  },
  {
    cls: 'damas',
    roman: 'II · Damas',
    title: 'Damas',
    desc: 'Cortes femeninos con la misma atención al detalle que nos caracteriza. Tu estilo, nuestro oficio.',
  },
  {
    cls: 'ninos',
    roman: 'III · Niños',
    title: 'Niños',
    desc: 'Un ambiente cálido y profesional para los más pequeños de la casa. Primer corte o mantenimiento.',
  },
];

export default function Audience() {
  return (
    <section className="audience">
      <div className="audience-inner">
        {PANES.map((p) => (
          <ScrollReveal key={p.cls} className={`audience-pane ${p.cls}`} tag="div">
            <div className="roman">{p.roman}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
