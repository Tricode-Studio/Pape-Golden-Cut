const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <div className="mk">
                <img src="/logo.jpg" alt="PAPE Golden Cut" />
              </div>
              <div>
                <div className="name">PAPE</div>
                <span className="sub">Golden Cut</span>
              </div>
            </div>
            <p className="tagline">
              Más que un corte, un oficio. Barbería de confianza en Trinidad, Flores, desde 2017.
            </p>
          </div>

          <div>
            <h5>Navegación</h5>
            <ul>
              <li><a href="#top">Inicio</a></li>
              <li><a href="#proceso">Cómo funciona</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#historia">Historia</a></li>
              <li><a href="#reserva">Reservar</a></li>
            </ul>
          </div>

          <div>
            <h5>Servicios</h5>
            <ul>
              <li><a href="#reserva">Corte de Cabello</a></li>
              <li><a href="#reserva">Barba</a></li>
              <li><a href="#reserva">Corte + Barba</a></li>
              <li><a href="#reserva">Tratamientos</a></li>
            </ul>
          </div>

          <div>
            <h5>Contacto</h5>
            <ul>
              <li><a href="https://wa.me/59898856783" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="#contacto">Dirección</a></li>
              <li><a href="#contacto">Horarios</a></li>
            </ul>
            <div className="social-row">
              <a href="https://wa.me/59898856783" target="_blank" rel="noopener" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/papegoldencut2016/" target="_blank" rel="noopener" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/PapeBarbershoop" target="_blank" rel="noopener" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} PAPE Golden Cut. Trinidad, Flores, Uruguay.</span>
          <span className="deco">PAPE</span>
          <span>Desarrollado por <a href="https://www.tricode.studio" target="_blank" rel="noopener" style={{color:'var(--gold)'}}>Tricode Studio</a></span>
        </div>
      </div>
    </footer>
  );
}
