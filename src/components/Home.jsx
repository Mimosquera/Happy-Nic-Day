import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import confetti from 'canvas-confetti';

const Home = () => {
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [shakeTriggered, setShakeTriggered] = useState(false);

  // 🎉 Confetti on page load
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, []);

  // ✅ Enable motion on iOS
  const enableMotionAccess = async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') {
          setMotionAllowed(true);
        } else {
          alert('Motion access denied 😢');
        }
      } catch (err) {
        console.error('Motion permission error:', err);
      }
    } else {
      setMotionAllowed(true);
    }
  };

  // 🤲 Long Press on the heart image
  useEffect(() => {
    let timer;
    const heart = document.getElementById('heart');
  
    const start = () => {
      timer = setTimeout(() => {
        setLongPressTriggered(true);
      }, 2000);
    };
  
    const cancel = () => clearTimeout(timer);
  
    if (heart) {
      heart.addEventListener('touchstart', (e) => {
        e.preventDefault();
        start();
      }, { passive: false });
  
      heart.addEventListener('mousedown', start);
      heart.addEventListener('touchend', cancel);
      heart.addEventListener('mouseup', cancel);
      heart.addEventListener('mouseleave', cancel);
      heart.addEventListener('touchmove', cancel);
      heart.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  
    return () => {
      heart?.removeEventListener('touchstart', start);
      heart?.removeEventListener('mousedown', start);
      heart?.removeEventListener('touchend', cancel);
      heart?.removeEventListener('mouseup', cancel);
      heart?.removeEventListener('mouseleave', cancel);
      heart?.removeEventListener('touchmove', cancel);
      heart?.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, []);  

  // 📳 Shake Detection
  useEffect(() => {
    if (!motionAllowed) return;

    let lastTime = new Date();
    let lastX = null, lastY = null, lastZ = null;
    const threshold = 20;

    const handleMotion = (event) => {
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const { x, y, z } = current;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);
        const total = deltaX + deltaY + deltaZ;

        const now = new Date();
        if (total > threshold && now - lastTime > 1000) {
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

      <Link to="/cake"><button>Blow Out the Cake</button></Link>
      <Link to="/would-you-still-date"><button>Would You Still Date Me If…</button></Link>
      <Link to="/compliments"><button>Compliment Machine</button></Link>

      <img
        id="heart"
        src="/purple-heart-pulse.gif"
        alt="purple-heart-pulse"
        width={250}
        height={250}
        style={{ marginTop: '1.5rem' }}
      />

      {!motionAllowed && (
        <button style={{ marginTop: '1.5rem' }} onClick={enableMotionAccess}>
          👉 Tap here to unlock a surprise!
        </button>
      )}

      {/* Floating hearts triggered ONLY by long press */}
      {longPressTriggered && (
  <div className="floating-hearts">
    {Array.from({ length: 10 }).map((_, i) => {
      const left = Math.random() * 100; // percent
      const size = Math.random() * 1.5 + 1; // 1x to 2.5x
      const delay = Math.random() * 5; // seconds
      const duration = Math.random() * 5 + 8; // 8 to 13s
      const emoji = i % 2 === 0 ? '💜' : '🤍';

      return (
        <span
          key={i}
          className="heart"
          style={{
            left: `${left}%`,
            fontSize: `${size}rem`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        >
          {emoji}
        </span>
      );
    })}
  </div>
)}

      {(longPressTriggered || shakeTriggered) && (
        <div style={{ marginTop: '2rem', fontSize: '1.4rem', animation: 'fadeIn 1s ease-in-out' }}>
          {longPressTriggered && (
            <p>✨ You held my heart long enough... just like real life 💜</p>
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
