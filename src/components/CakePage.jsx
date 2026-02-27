import React, { useState, useRef, useEffect } from 'react';
import BackButton from './BackButton';

const CakePage = () => {
  const [candlesOut, setCandlesOut] = useState(false);
  const [listening, setListening] = useState(false);

  const audioRef = useRef(new Audio('/blow-out.mp3'));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    return () => stopListening();
  }, []);

  const startListening = async () => {
    if (listening) return;
    setListening(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      audioContext.createMediaStreamSource(stream).connect(analyser);

      dataRef.current = new Uint8Array(analyser.fftSize);
      analyserRef.current = analyser;

      detectWish();
    } catch {
      setListening(false);
    }
  };

  const detectWish = () => {
    if (!analyserRef.current || !dataRef.current) return;

    analyserRef.current.getByteTimeDomainData(dataRef.current);

    let sum = 0;
    for (let i = 0; i < dataRef.current.length; i++) {
      const d = dataRef.current[i] - 128;
      sum += d * d;
    }

    const volume = Math.sqrt(sum / dataRef.current.length) * 10;

    if (volume > 300) {
      stopListening();
      setCandlesOut(true);
      audioRef.current.play();
    } else {
      rafIdRef.current = requestAnimationFrame(detectWish);
    }
  };

  const stopListening = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setListening(false);
  };

  const resetCake = () => {
    stopListening();
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCandlesOut(false);
  };

  return (
    <div className="page">
      <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)' }}>Make a wish!</h1>
      <img
        src="/cake.png"
        alt="birthday cake"
        className={`cake-img${candlesOut ? ' blow-out' : ''}`}
      />
      {!candlesOut ? (
        <button className="btn-sm" onClick={startListening} disabled={listening}>
          {listening ? 'Listening...' : 'Blow Candles! 💨'}
        </button>
      ) : (
        <>
          <p style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', fontWeight: 700, color: '#5a0080' }}>
            Your wish better be about me ;)
          </p>
          <button className="btn-sm btn-ghost" onClick={resetCake}>New Cake 🎂</button>
        </>
      )}
      <BackButton />
      <footer className="year-footer">2025</footer>
    </div>
  );
};

export default CakePage;
