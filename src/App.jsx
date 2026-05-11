import { useState, useCallback, useRef } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Process from './components/sections/Process';
import Services from './components/sections/Services';
import Audience from './components/sections/Audience';
import Story from './components/sections/Story';
import Reservation from './components/sections/Reservation';
import Contact from './components/sections/Contact';
import Toast from './components/ui/Toast';
import WhatsAppFab from './components/ui/WhatsAppFab';

export default function App() {
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const timerRef = useRef(null);

  const showToast = useCallback((message, isError = false) => {
    clearTimeout(timerRef.current);
    setToast({ show: true, message, isError });
    timerRef.current = setTimeout(
      () => setToast(t => ({ ...t, show: false })),
      3800
    );
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Process />
        <Services />
        <Audience />
        <Story />
        <Reservation showToast={showToast} />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <Toast message={toast.message} isError={toast.isError} show={toast.show} />
    </>
  );
}
