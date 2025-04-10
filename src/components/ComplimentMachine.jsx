import React, { useState } from 'react';
import BackButton from './BackButton';

const compliments = [
  "You’re the cutest human ever. It’s scientifically proven.",
  "If you were a vegetable, you’d be a cutecumber.",
  "You light up my life more than my phone screen at 2AM.",
  "You're the reason my phone battery is always low — I can’t stop texting you.",
];

const ComplimentMachine = () => {
  const [compliment, setCompliment] = useState('');

  const giveCompliment = () => {
    const random = compliments[Math.floor(Math.random() * compliments.length)];
    setCompliment(random);
  };

  return (
    <div className="page">
      <h2>Daily Compliment Machine</h2>
      <button onClick={giveCompliment}>Give Me Compliment</button>
      {compliment && <p>{compliment}</p>}
      <BackButton />
    </div>
  );
};

export default ComplimentMachine;
