import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import confetti from 'canvas-confetti';

const needsMotionPermission =
  typeof DeviceMotionEvent !== 'undefined' &&
  typeof DeviceMotionEvent.requestPermission === 'function';

const Home = () => {
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [heartsVisible, setHeartsVisible] = useState(false);
  const [shakeTriggered, setShakeTriggered] = useState(false);
  const [holdingHeart, setHoldingHeart] = useState(false);
  const [popping, setPopping] = useState(false);
  const [balloonPopped, setBalloonPopped] = useState(false);
  const heartRef = useRef(null);
  const messageVisibleRef = useRef(false);

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

  useEffect(() => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  }, []);

  const handleBalloonClick = async () => {
    // Request permission immediately (must be in user-gesture context for iOS)
    if (needsMotionPermission) {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        if (result === 'granted') setShakeEnabled(true);
      } catch {
        // permission denied or unavailable
      }
    } else {
      setShakeEnabled(true);
    }
    setPopping(true);
  };

  useEffect(() => {
    const heart = heartRef.current;
    if (!heart) return;

    let timer;

    const start = () => {
      timer = setTimeout(() => {
        if (!messageVisibleRef.current) {
          messageVisibleRef.current = true;
          setMessageVisible(true);
          setHeartsVisible(true);
        } else {
          setHeartsVisible((prev) => !prev);
        }
      }, 1000);
    };

    const cancel = () => {
      setHoldingHeart(false);
      clearTimeout(timer);
    };

    const onTouchStart = (e) => {
      e.preventDefault();
      setHoldingHeart(true);
      start();
    };

    const onMouseDown = () => {
      setHoldingHeart(true);
      start();
    };

    heart.addEventListener('touchstart', onTouchStart, { passive: false });
    heart.addEventListener('mousedown', onMouseDown);
    heart.addEventListener('touchend', cancel);
    heart.addEventListener('mouseup', cancel);
    heart.addEventListener('mouseleave', cancel);
    heart.addEventListener('touchmove', cancel);
    heart.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      clearTimeout(timer);
      heart.removeEventListener('touchstart', onTouchStart);
      heart.removeEventListener('mousedown', onMouseDown);
      heart.removeEventListener('touchend', cancel);
      heart.removeEventListener('mouseup', cancel);
      heart.removeEventListener('mouseleave', cancel);
      heart.removeEventListener('touchmove', cancel);
    };
  }, []);

  useEffect(() => {
    if (!shakeEnabled) return;

    let lastTriggered = Date.now();
    let lastX = null, lastY = null, lastZ = null;

    const onMotion = (e) => {
      const now = Date.now();
      if (now - lastTriggered < 1000) return;

      const accel = e.acceleration;
      if (accel && accel.x != null) {
        if (Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z) > 12) {
          lastTriggered = now;
          setShakeTriggered(true);
          confetti();
        }
        return;
      }

      const raw = e.accelerationIncludingGravity;
      if (!raw) return;
      if (lastX !== null) {
        const delta = Math.abs(raw.x - lastX) + Math.abs(raw.y - lastY) + Math.abs(raw.z - lastZ);
        if (delta > 15) {
          lastTriggered = now;
          setShakeTriggered(true);
          confetti();
        }
      }
      lastX = raw.x; lastY = raw.y; lastZ = raw.z;
    };

    window.addEventListener('devicemotion', onMotion);
    return () => window.removeEventListener('devicemotion', onMotion);
  }, [shakeEnabled]);

  return (
    <div className="home-container">
      <h1>Happy Birthday! 💜</h1>

      <div className="nav-buttons">
        <Link to="/cake"><button>Blow Out the Cake</button></Link>
        <Link to="/would-you-still-date"><button>Would You Still Date Me If…</button></Link>
        <Link to="/compliments"><button>Compliment Machine</button></Link>
      </div>

      <div style={{ position: 'relative', display: 'inline-block', marginTop: '28px' }}>
        <div ref={heartRef} className={`heart-outer${holdingHeart ? ' heart-pulsing' : ''}`}>
          <div className="heart-wrap">
            <img
              src="/purple-heart-pulse.gif"
              alt="pulsing purple heart"
              className="heart-img"
            />
          </div>
        </div>
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

      <div className="balloon-slot">
        {!balloonPopped && (
          <span className="balloon-wrap">
            <button
              className="balloon-btn"
              onClick={handleBalloonClick}
              aria-label="Enable shake"
            >
              <span
                className={popping ? 'balloon-emoji balloon-emoji-pop' : 'balloon-emoji'}
                onAnimationEnd={(e) => {
                  if (e.animationName === 'balloonPop') {
                    setBalloonPopped(true);
                  }
                }}
              >
                🎈
              </span>
            </button>
          </span>
        )}
      </div>

      {heartsVisible && (
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

      <div className="heart-message-area">
        {messageVisible && (
          <p className="heart-message">✨ You held my heart long enough… <br className="mobile-break" />just like real life 💜</p>
        )}
        {shakeTriggered && (
          <p className="heart-message">📱 You shook things up… just like you shook up my world 🌎💘</p>
        )}
      </div>

      <footer className="year-footer">
        2025
      </footer>
    </div>
  );
};

export default Home;
