import React, { useState, useRef } from 'react';
import BackButton from './BackButton';

const CakePage = () => {
  const [candlesOut, setCandlesOut] = useState(false);
  const [listening, setListening] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const dataRef = useRef(null);
  const audioRef = useRef(new Audio('/blow-out.mp3'));

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("🎤 Got audio stream:", stream);
      mediaStreamRef.current = stream;

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      // Boost volume just in case
      const gainNode = audioContextRef.current.createGain();
      gainNode.gain.value = 2.0;

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512; // Set before creating data buffer
      dataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount); // freqBinCount = fftSize / 2

      // Connect nodes: mic → gain → analyser
      source.connect(gainNode);
      gainNode.connect(analyserRef.current);

      setListening(true);

      const detectBlow = () => {
        analyserRef.current.getByteFrequencyData(dataRef.current);

        let volume = 0;
        for (let i = 0; i < dataRef.current.length; i++) {
          volume += dataRef.current[i];
        }
        volume = volume / dataRef.current.length;
        console.log('📈 Mic volume (frequency):', volume);

        if (volume > 15) { // Sensitivity threshold
          stopListening();
          setCandlesOut(true);
          audioRef.current.play();
        } else if (listening) {
          requestAnimationFrame(detectBlow);
        }
      };

      detectBlow();
    } catch (err) {
      console.error('🚫 Microphone access error:', err);
    }
  };

  const stopListening = () => {
    setListening(false);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const resetCake = () => {
    setCandlesOut(false);
    setListening(false);
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
        <button onClick={startListening} disabled={listening}>
          {listening ? 'Listening...' : 'Blow Candles!' }
        </button>
      ) : (
        <>
          <p>Your wish better be about me.</p>
          <button onClick={resetCake}>New Cake</button>
        </>
      )}
      <BackButton />
    </div>
  );
};

export default CakePage;
