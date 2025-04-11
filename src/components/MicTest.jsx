import React, { useEffect, useRef, useState } from 'react';

const MicTest = () => {
  const [volume, setVolume] = useState(0);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const dataRef = useRef(null);

  useEffect(() => {
    const setupMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);

        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512;
        dataRef.current = new Uint8Array(analyserRef.current.fftSize);

        source.connect(analyserRef.current);

        const update = () => {
          analyserRef.current.getByteTimeDomainData(dataRef.current);
          let sum = 0;
          for (let i = 0; i < dataRef.current.length; i++) {
            const deviation = dataRef.current[i] - 128;
            sum += deviation * deviation;
          }
          const rms = Math.sqrt(sum / dataRef.current.length);
          const boosted = rms * 10;
          setVolume(boosted);
          requestAnimationFrame(update);
        };

        update();
      } catch (err) {
        console.error("Mic access error:", err);
      }
    };

    setupMic();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎙️ Mic Volume Test</h2>
      <p>Speak or blow into your mic to test input detection.</p>
      <div style={{
        height: '20px',
        width: `${Math.min(volume * 20, 300)}px`,
        backgroundColor: 'purple',
        transition: 'width 0.1s linear'
      }} />
      <p>Volume: {volume.toFixed(2)}</p>
    </div>
  );
};

export default MicTest;
