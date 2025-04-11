import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';

const compliments = [
  "You’re the cutest human ever. It’s scientifically proven.",
  "If you were a vegetable, you’d be a cutecumber.",
  "You light up my life more than my phone screen at 2AM.",
  "You're the reason my phone battery is always low — I can’t stop texting you.",
  "You're better than the perfect playlist at the perfect moment.",
  "You're the marshmallow in my cereal of life.",
  "Your smile is my favorite notification.",
  "You’re the main character — always have been.",
  "You're the only reason I'd share my fries.",
  "You make my heart do the WiFi reconnect dance.",
  "You’re the sparkles in my soda and the kick in my coffee.",
  "Even my dreams have a crush on you.",
  "You could win a gold medal in adorableness.",
  "You're like a cozy hoodie on a rainy day — but hotter.",
  "If cuteness was a superpower, you'd be unstoppable.",
  "You're the secret ingredient to all my favorite memories.",
  "You’re proof that soulmates are a thing.",
  "Even the stars are jealous of how bright you shine.",
  "You're my favorite notification of all time.",
  "You’re basically the human version of a double rainbow.",
  "Your laugh should be an alarm sound — it makes everything better.",
  "You’re the reason I check my phone every 2 seconds.",
  "You’re the perfect mix of chaos and cuddles.",
  "If I had a dollar for every time you made me smile, I’d own the moon.",
  "You’re the playlist I never skip.",
  "Your weirdness perfectly matches mine.",
  "You make every outfit look like a red carpet moment.",
  "You're my daily dose of serotonin.",
  "You could wear a trash bag and still slay.",
  "You're so cute it's basically a superpower."
];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ComplimentMachine = () => {
  const [shuffled, setShuffled] = useState([]);
  const [index, setIndex] = useState(-1); // -1 so nothing shows until first click
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    setShuffled(shuffle(compliments));
  }, []);

  const giveCompliment = () => {
    if (index < shuffled.length - 1) {
      setIndex(index + 1);
    } else {
      setShuffled(shuffle(compliments));
      setIndex(0);
    }
    setFadeKey(prev => prev + 1);
  };

  return (
    <div className="page">
      <h2>Daily Compliment Machine</h2>
      <img
        src="/smiling-speech-bubble.png"
        alt="smiling-speech-bubble"
        style={{ width: '300px' }}
      />
      <button onClick={giveCompliment}>Give Me Compliment 💌</button>
      {index >= 0 && (
        <p key={fadeKey} className="fade-in" style={{ maxWidth: '80%', margin: '20px auto' }}>
          {shuffled[index]}
        </p>
      )}
      <BackButton />
    </div>
  );
};

export default ComplimentMachine;