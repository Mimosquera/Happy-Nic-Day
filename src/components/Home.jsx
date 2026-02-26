import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import confetti from 'canvas-confetti';

const Home = () => {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [shakeTriggered, setShakeTriggered] = useState(false);
  const [holdingHeart, setHoldingHeart] = useState(false);
  const heartRef = useRef(null);

  // Stable random heart data — computed once so positions don't jump on re-render
  const heartData = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      left: Math.random() * 100,
      size: Math.random() * 1.5 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 8,
      emoji: i % 2 === 0 ? '💜' : '🤍',
    })),
    []
  );

  // 🎉 Confetti on page load
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, []);

  // 📳 Enable motion immediately on non-iOS (no permission needed)
  useEffect(() => {
    if (
      typeof DeviceMotionEvent === 'undefined' ||
      typeof DeviceMotionEvent.requestPermission !== 'function'
    ) {
      setMotionAllowed(true);
    }
  }, []);

  // 🤲 Long press + iOS motion permission on heart touch
  useEffect(() => {
    const heart = heartRef.current;
    if (!heart) return;

    let timer;

    const start = () => {
      timer = setTimeout(() => {
        setLongPressTriggered(true);
      }, 1000);
    };

    const cancel = () => {
      setHoldingHeart(false);
      clearTimeout(timer);
    };

    const handleTouchStart = async (e) => {
      e.preventDefault();
      setHoldingHeart(true);

      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function'
      ) {
        try {
          const result = await DeviceMotionEvent.requestPermission();
          if (result === 'granted') setMotionAllowed(true);
        } catch (err) {
          console.warn('Motion permission denied:', err);
        }
      } else {
        setMotionAllowed(true);
      }

      start();
    };

    const handleMouseDown = () => {
      setHoldingHeart(true);
      start();
    };

    const handleContextMenu = (e) => e.preventDefault();

    heart.addEventListener('touchstart', handleTouchStart, { passive: false });
    heart.addEventListener('mousedown', handleMouseDown);
    heart.addEventListener('touchend', cancel);
    heart.addEventListener('mouseup', cancel);
    heart.addEventListener('mouseleave', cancel);
    heart.addEventListener('touchmove', cancel);
    heart.addEventListener('contextmenu', handleContextMenu);

    return () => {
      clearTimeout(timer);
      heart.removeEventListener('touchstart', handleTouchStart);
      heart.removeEventListener('mousedown', handleMouseDown);
      heart.removeEventListener('touchend', cancel);
      heart.removeEventListener('mouseup', cancel);
      heart.removeEventListener('mouseleave', cancel);
      heart.removeEventListener('touchmove', cancel);
      heart.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // 📳 Shake detection
  useEffect(() => {
    if (!motionAllowed) return;

    let lastTime = Date.now();
    let lastX = null, lastY = null, lastZ = null;
    const THRESHOLD = 15;

    const handleMotion = (event) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const { x, y, z } = current;

      if (lastX !== null) {
        const total =
          Math.abs(x - lastX) +
          Math.abs(y - lastY) +
          Math.abs(z - lastZ);

        const now = Date.now();
        if (total > THRESHOLD && now - lastTime > 1000) {
          lastTime = now;
          setShakeTriggered(true);
          confetti();
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [motionAllowed]);

  return (
    <div className="home-container">
      <h1>Happy Birthday! 💜</h1>

      <div className="nav-buttons">
        <Link to="/cake"><button>Blow Out the Cake</button></Link>
        <Link to="/would-you-still-date"><button>Would You Still Date Me If…</button></Link>
        <Link to="/compliments"><button>Compliment Machine</button></Link>
      </div>

      <div style={{ position: 'relative', display: 'inline-block', marginTop: '12px' }}>
        <img
          ref={heartRef}
          src="/purple-heart-pulse.gif"
          alt="pulsing purple heart"
          className="heart-img"
          style={{ animation: holdingHeart ? 'pulse 1s infinite' : 'none' }}
        />
        {holdingHeart && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '110%',
              height: '110%',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              border: '3px dashed #d3b3ff',
              animation: 'pulseOutline 1.5s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {longPressTriggered && (
        <div className="floating-hearts">
          {heartData.map((h, i) => (
            <span
              key={i}
              className="heart"
              style={{
                left: `${h.left}%`,
                fontSize: `${h.size}rem`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
              }}
            >
              {h.emoji}
            </span>
          ))}
        </div>
      )}

      {(longPressTriggered || shakeTriggered) && (
        <div className="message-box">
          {longPressTriggered && (
            <p>✨ You held my heart long enough… just like real life 💜</p>
          )}
          {shakeTriggered && (
            <p>📱 You shook things up… just like you shook up my world 🌎💘</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
