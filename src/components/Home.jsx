import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import confetti from 'canvas-confetti';

const Home = () => {
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, []);

  useEffect(() => {
    let timer;
    const heart = document.getElementById('heart');

    const start = () => {
      timer = setTimeout(() => {
        setShowSecret(true);
      }, 2000); // 2-second long press
    };

    const cancel = () => clearTimeout(timer);

    heart?.addEventListener('touchstart', start);
    heart?.addEventListener('mousedown', start);
    heart?.addEventListener('touchend', cancel);
    heart?.addEventListener('mouseup', cancel);
    heart?.addEventListener('mouseleave', cancel);
    heart?.addEventListener('touchmove', cancel);

    return () => {
      heart?.removeEventListener('touchstart', start);
      heart?.removeEventListener('mousedown', start);
      heart?.removeEventListener('touchend', cancel);
      heart?.removeEventListener('mouseup', cancel);
      heart?.removeEventListener('mouseleave', cancel);
      heart?.removeEventListener('touchmove', cancel);
    };
  }, []);

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

      {showSecret && (
        <div style={{ marginTop: '2rem', fontSize: '1.4rem', animation: 'fadeIn 1s ease-in-out' }}>
          ✨ You held my heart long enough... just like real life 💜
        </div>
      )}
    </div>
  );
};

export default Home;
