import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import confetti from 'canvas-confetti';

const needsMotionPermission =
  typeof DeviceMotionEvent !== 'undefined' &&
  typeof DeviceMotionEvent.requestPermission === 'function';

const Home = () => {
  const [shakeEnabled, setShakeEnabled] = useState(() => {
    if (needsMotionPermission) return localStorage.getItem('motionPermission') === 'granted';
    return false;
  });
  const [activeMessage, setActiveMessage] = useState(null);
  const [heartsVisible, setHeartsVisible] = useState(false);
  const [holdingHeart, setHoldingHeart] = useState(false);
  const [ringVisible, setRingVisible] = useState(false);
  const [popping, setPopping] = useState(false);
  const [balloonPopped, setBalloonPopped] = useState(false);
  const [balloonTop, setBalloonTop] = useState(() => (window.visualViewport?.height ?? window.innerHeight) + 80);
  const [risenBalloonPopping, setRisenBalloonPopping] = useState(false);
  const [balloonKey, setBalloonKey] = useState(0);
  const [balloonTransition, setBalloonTransition] = useState('top 6s ease-out');

  const heartRef = useRef(null);
  const activeMessageRef = useRef(null);
  const touchOriginRef = useRef(null);
  const heartMessageAreaRef = useRef(null);
  const shakeReadyRef = useRef(false);
  const footerRef = useRef(null);
  const risenRef = useRef(null);
  const targetTopRef = useRef(null);
  const cleanupRef = useRef(null);
  const risenBalloonPoppingRef = useRef(false);

  useEffect(() => { activeMessageRef.current = activeMessage; }, [activeMessage]);
  useEffect(() => { risenBalloonPoppingRef.current = risenBalloonPopping; }, [risenBalloonPopping]);

  const calcTarget = () => {
    const msg = heartMessageAreaRef.current;
    const ft = footerRef.current;
    if (!msg || !ft) return null;
    const msgBottom = msg.getBoundingClientRect().bottom;
    const footerTop = ft.getBoundingClientRect().top;
    const balloonH = risenRef.current ? risenRef.current.getBoundingClientRect().height : 144;
    return msgBottom + (footerTop - msgBottom) / 2 - balloonH / 2;
  };

  // first rise after balloon-slot finishes collapsing
  useEffect(() => {
    if (!balloonPopped) return;
    const id = setTimeout(() => {
      const target = calcTarget();
      if (target == null) return;
      targetTopRef.current = target;
      setBalloonTransition('top 6s ease-out');
      setBalloonTop(target);
    }, 1600);
    return () => clearTimeout(id);
  }, [balloonPopped]);

  // re-rise after each pop: snap off-screen, then float back up
  useEffect(() => {
    if (!risenBalloonPopping) return;
    const id = setTimeout(() => {
      setRisenBalloonPopping(false);
      setBalloonTransition('none');
      setBalloonTop((window.visualViewport?.height ?? window.innerHeight) + 80);
      setBalloonKey((k) => k + 1);
    }, 500);
    return () => clearTimeout(id);
  }, [risenBalloonPopping]);

  useEffect(() => {
    if (balloonKey === 0 || targetTopRef.current == null) return;
    const fresh = calcTarget();
    if (fresh != null) targetTopRef.current = fresh;
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setBalloonTransition('top 6s ease-out');
        setBalloonTop(targetTopRef.current);
      });
      cleanupRef.current = raf2;
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (cleanupRef.current) cancelAnimationFrame(cleanupRef.current);
    };
  }, [balloonKey]);

  // nudge balloon whenever a message appears or switches
  useEffect(() => {
    if (!balloonPopped || !activeMessage) return;
    const raf = requestAnimationFrame(() => {
      if (risenBalloonPoppingRef.current) return;
      const fresh = calcTarget();
      if (fresh == null) return;
      targetTopRef.current = fresh;
      setBalloonTransition('top 1.5s ease-in-out');
      setBalloonTop(fresh);
    });
    return () => cancelAnimationFrame(raf);
  }, [activeMessage, balloonPopped]);

  const heartData = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      left: Math.random() * 100,
      size: Math.random() * 1.5 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 8,
      emoji: i % 2 === 0 ? '\u2665\uFE0E' : '\u2661',
      color: i % 2 === 0 ? '#8b00b6' : '#a040c8',
    })),
    []
  );

  useEffect(() => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  }, []);

  const handleBalloonClick = async () => {
    if (needsMotionPermission) {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        if (result === 'granted') {
          localStorage.setItem('motionPermission', 'granted');
          setShakeEnabled(true);
        }
      } catch {}
    } else {
      setShakeEnabled(true);
    }
    setPopping(true);
  };

  const handleRisenBalloonClick = () => {
    if (risenBalloonPopping) return;
    if (activeMessageRef.current === 'heart') shakeReadyRef.current = true;
    setRisenBalloonPopping(true);
  };

  useEffect(() => {
    const heart = heartRef.current;
    if (!heart) return;
    let timer;

    const start = () => {
      timer = setTimeout(() => {
        if (activeMessageRef.current === 'heart') {
          setHeartsVisible((prev) => !prev);
        } else {
          setActiveMessage('heart');
          setHeartsVisible(true);
        }
        setHoldingHeart(false);
        setRingVisible(true);
        setTimeout(() => setRingVisible(false), 2000);
        if (navigator.vibrate) navigator.vibrate(200);
      }, 1000);
    };

    const cancel = () => {
      setHoldingHeart(false);
      clearTimeout(timer);
    };

    const onTouchStart = (e) => {
      e.preventDefault();
      touchOriginRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setHoldingHeart(true);
      start();
    };

    const onTouchMove = (e) => {
      if (!touchOriginRef.current) return;
      const dx = e.touches[0].clientX - touchOriginRef.current.x;
      const dy = e.touches[0].clientY - touchOriginRef.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 12) cancel();
    };

    const onMouseDown = () => { setHoldingHeart(true); start(); };

    heart.addEventListener('touchstart', onTouchStart, { passive: false });
    heart.addEventListener('touchend', cancel);
    heart.addEventListener('touchmove', onTouchMove);
    heart.addEventListener('mousedown', onMouseDown);
    heart.addEventListener('mouseup', cancel);
    heart.addEventListener('mouseleave', cancel);
    heart.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      clearTimeout(timer);
      heart.removeEventListener('touchstart', onTouchStart);
      heart.removeEventListener('touchend', cancel);
      heart.removeEventListener('touchmove', onTouchMove);
      heart.removeEventListener('mousedown', onMouseDown);
      heart.removeEventListener('mouseup', cancel);
      heart.removeEventListener('mouseleave', cancel);
    };
  }, []);

  useEffect(() => {
    if (!shakeEnabled) return;
    let lastTriggered = Date.now();
    let lastX = null, lastY = null, lastZ = null;

    const onMotion = (e) => {
      const now = Date.now();
      if (!shakeReadyRef.current && now - lastTriggered < 1000) return;

      const accel = e.acceleration;
      if (accel && accel.x != null) {
        if (Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z) > 12) {
          lastTriggered = now;
          shakeReadyRef.current = false;
          setActiveMessage('shake');
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
          shakeReadyRef.current = false;
          setActiveMessage('shake');
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
      <h1 style={{ whiteSpace: 'nowrap', fontSize: 'min(8.5vw, 3.8rem)' }}>Happy 24th Birthday! ♥︎</h1>

      <div className="nav-buttons">
        <Link to="/cake"><button>Blow Out the Cake</button></Link>
        <Link to="/would-you-still-date"><button>Would You Still Date Me If…</button></Link>
        <Link to="/compliments"><button>Compliment Machine</button></Link>
      </div>

      <div className="heart-area-wrap" style={{ position: 'relative', display: 'inline-block' }}>
        <div ref={heartRef} className={`heart-outer${holdingHeart ? ' heart-pulsing' : ''}`}>
          <div className="heart-wrap">
            <img src="/purple-heart-pulse.gif" alt="pulsing purple heart" className="heart-img" />
          </div>
        </div>
        {(holdingHeart || ringVisible) && (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '110%', height: '110%',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            border: '3px dashed #d3b3ff',
            animation: holdingHeart ? 'pulseOutline 1.5s ease-in-out infinite' : 'none',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      <div className={`balloon-slot${balloonPopped ? ' balloon-slot-popped' : ''}`}>
        {!balloonPopped && (
          <span className="balloon-wrap">
            <button className="balloon-btn" onClick={handleBalloonClick} aria-label="Pop balloon">
              <span
                className={popping ? 'balloon-emoji balloon-emoji-pop' : 'balloon-emoji'}
                onAnimationEnd={(e) => {
                  if (e.animationName === 'balloonPop') setBalloonPopped(true);
                }}
              >
                <img src="/purple%20balloonn.png" alt="balloon" className="balloon-img" />
              </span>
            </button>
          </span>
        )}
      </div>

      {heartsVisible && (
        <div className="floating-hearts">
          {heartData.map((h, i) => (
            <span key={i} className="heart" style={{
              left: `${h.left}%`,
              fontSize: `${h.size}rem`,
              animationDelay: `${h.delay}s`,
              animationDuration: `${h.duration}s`,
              color: h.color,
            }}>
              {h.emoji}
            </span>
          ))}
        </div>
      )}

      <div className="heart-message-area" ref={heartMessageAreaRef}>
        {activeMessage === 'heart' && (
          <p key="heart" className="heart-message heart-msg-heart">
            You held my heart long enough… <br className="mobile-break" />just like real life ♥︎
          </p>
        )}
        {activeMessage === 'shake' && (
          <p key="shake" className="heart-message heart-msg-shake">
            You shook things up… <br className="mobile-break" />just like you shook up my world ♥︎
          </p>
        )}
      </div>

      {balloonPopped && (
        <div
          ref={risenRef}
          className="balloon-rising-fixed"
          style={{ top: `${balloonTop}px`, transition: balloonTransition }}
          aria-hidden="true"
        >
          <span key={balloonKey} className="balloon-wrap-fixed" onClick={handleRisenBalloonClick}>
            <span className={`balloon-emoji-fixed${risenBalloonPopping ? ' balloon-emoji-fixed-pop' : ''}`}>
              <img src="/purple%20balloonn.png" alt="balloon" className="balloon-img" />
            </span>
          </span>
        </div>
      )}

      <footer className="year-footer" ref={footerRef}>2025</footer>
    </div>
  );
};

export default Home;
