import React, { useState, useRef, useEffect } from 'react';
import BackButton from './BackButton';

const CakePage = () => {
  const [candlesOut, setCandlesOut] = useState(false);
  const [listening, setListening] = useState(false);
  const [cheaterMode, setCheaterMode] = useState(false);

  const audioRef = useRef(new Audio('/blow-out.mp3'));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    return () => {
      stopListening(); // clean up on unmount
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;

      const dataArray = new Uint8Array(analyser.fftSize);
      dataRef.current = dataArray;
      analyserRef.current = analyser;

      source.connect(analyser);

      setListening(true);
      console.log('🎤 Started listening');

      detectWish();
    } catch (error) {
      console.error('🚫 Mic error:', error);
    }
  };

  const detectWish = () => {
    if (!analyserRef.current || !dataRef.current) return;

    analyserRef.current.getByteTimeDomainData(dataRef.current);

    let sum = 0;
    for (let i = 0; i < dataRef.current.length; i++) {
      const deviation = dataRef.current[i] - 128;
      sum += deviation * deviation;
    }

    const rms = Math.sqrt(sum / dataRef.current.length);
    const volume = rms * 10; // scale up
    console.log('💨 Mic RMS volume:', volume.toFixed(2));

    if (volume > 30) {
      console.log('🎉 Wish detected!');
      stopListening();
      setCandlesOut(true);
      audioRef.current.play();
    } else {
      rafIdRef.current = requestAnimationFrame(detectWish);
    }
  };

  const stopListening = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setListening(false);
    console.log('🛑 Stopped listening');
  };

  const resetCake = () => {
    stopListening();
    setCandlesOut(false);
    setCheaterMode(false);
  };

  return (
    <div className="page">
      <h2>Make a wish!</h2>
      <img
        src="/cake.png"
        alt="birthday cake"
        className={candlesOut ? 'blow-out' : ''}
        style={{ width: '300px', transition: 'filter 0.4s ease' }}
      />

      {!candlesOut ? (
        <>
          <button onClick={startListening} disabled={listening}>
            {listening ? 'Listening...' : 'Blow Candles!'}
          </button>

          {!listening && (
            <button
              style={{ marginTop: '0.8rem' }}
              onClick={() => {
                setCandlesOut(true);
                setCheaterMode(true);
                audioRef.current.play();
              }}
            >
              Blow (cheater mode 😏)
            </button>
          )}
        </>
      ) : (
        <>
          <p>
            {cheaterMode
              ? "I'll allow it... just this once 😌"
              : "Your wish better be about me."}
          </p>
          <button onClick={resetCake}>New Cake</button>
        </>
      )}

      <BackButton />
    </div>
  );
};

export default CakePage;
