import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="announce">
        <div className="container">
          <div className="announce-track">
            <span>
              <span className="dot" />
              Trinidad · Flores · Uruguay
            </span>
            <span>Lun – Sáb &nbsp;|&nbsp; 9:00 – 19:00</span>
            <span>
              <span className="dot" />
              Reservas online disponibles
            </span>
          </div>
        </div>
      </div>

      <header id="topbar" className={scrolled ? 'scrolled' : ''}>
        <div className="container">
          <div className="header-inner">
            <a href="#top" className="brand">
              <div className="brand-mark">
                <img src="/logo.jpg" alt="PAPE Golden Cut" />
              </div>
              <div className="brand-text">
                <span className="name">PAPE</span>
                <span className="sub">Golden Cut</span>
              </div>
            </a>

            <nav className="primary">
              <a href="#proceso">Proceso</a>
              <a href="#servicios">Servicios</a>
              <a href="#historia">Historia</a>
              <a href="#contacto">Contacto</a>
            </nav>

            <a href="#reserva" className="btn btn-solid">Reservar Hora</a>

            <button className="menu-toggle" aria-label="Menú">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="4" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="8" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
