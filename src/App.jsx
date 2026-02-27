import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CakePage from './components/CakePage';
import WouldYouStillDate from './components/WouldYouStillDate';
import ComplimentMachine from './components/ComplimentMachine';
import MicTest from './components/MicTest';

function App() {
  useEffect(() => {
    const timers = new WeakMap();

    const handleTouchStart = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (timers.has(btn)) { clearTimeout(timers.get(btn)); timers.delete(btn); }
      btn.classList.remove('touch-hover');
    };

    const handleTouchEnd = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      btn.classList.add('touch-hover');
      const id = setTimeout(() => {
        btn.classList.remove('touch-hover');
        timers.delete(btn);
      }, 500);
      timers.set(btn, id);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cake" element={<CakePage />} />
        <Route path="/would-you-still-date" element={<WouldYouStillDate />} />
        <Route path="/compliments" element={<ComplimentMachine />} />
        <Route path="/mic-test" element={<MicTest />} />
      </Routes>
  );
}

export default App;
