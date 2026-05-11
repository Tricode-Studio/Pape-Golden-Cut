import ScrollReveal from '../ui/ScrollReveal';
import { useLandingConfig } from '../../hooks/useLandingConfig';

const DEFAULTS = {
  address:  'Herrera e Inés Durán, Trinidad, Flores',
  hours:    'Lun – Sáb · 9:00 – 19:00',
  phone:    '+598 98 856 783',
  waNumber: '59898856783',
};

function MapSVG() {
  return (
    <>
      <svg className="map-grid" viewBox="0 0 400 500" fill="none" preserveAspectRatio="none">
        <line x1="0" y1="167" x2="400" y2="167" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
        <line x1="0" y1="250" x2="400" y2="250" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
        <line x1="0" y1="333" x2="400" y2="333" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
        <line x1="133" y1="0" x2="133" y2="500" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
        <line x1="267" y1="0" x2="267" y2="500" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
        <line x1="0" y1="230" x2="400" y2="230" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
        <line x1="0" y1="270" x2="400" y2="270" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
        <line x1="180" y1="0" x2="180" y2="500" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
        <line x1="220" y1="0" x2="220" y2="500" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
        <rect x="10"  y="10"  width="100" height="80" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
        <rect x="290" y="10"  width="100" height="80" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
        <rect x="10"  y="290" width="100" height="80" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
        <rect x="290" y="290" width="100" height="80" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
        <rect x="10"  y="410" width="100" height="80" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
        <rect x="290" y="410" width="100" height="80" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
      </svg>
      <span className="street-label s1">Herrera</span>
      <span className="street-label s2">Inés Durán</span>
      <div className="pin">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    </>
  );
}

export default function Contact() {
  const { data } = useLandingConfig();
  const contact  = data?.contact ?? DEFAULTS;
  const waNumber = contact.waNumber ?? DEFAULTS.waNumber;

  return (
    <section className="contact" id="contacto">
      <div className="container">
        <div className="contact-grid">
          <ScrollReveal>
            <div>
              <h2>
                <span className="script">Visitanos</span>
                en Trinidad
              </h2>
              <div className="contact-info">
                <div className="contact-row">
                  <div className="ic">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <div className="lbl">Dirección</div>
                    <div className="val">{contact.address ?? DEFAULTS.address}</div>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="ic">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="lbl">Horarios</div>
                    <div className="val">{contact.hours ?? DEFAULTS.hours}</div>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="ic">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="lbl">WhatsApp</div>
                    <div className="val">
                      <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener">
                        {contact.phone ?? DEFAULTS.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="contact-map">
              <MapSVG />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
