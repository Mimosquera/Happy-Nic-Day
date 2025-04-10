import React, { useState } from 'react';
import BackButton from './BackButton';

const questions = [
  "Would you still date me if I was a worm?",
  "Would you still date me if I barked instead of talked?",
  "Would you still date me if I only wore Crocs?",
  "Would you still date me if I turned into Shrek every night?",
];

const WouldYouStillDate = () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="page">
      <h2>{questions[index]}</h2>
      <button onClick={() => setIndex((index + 1) % questions.length)}>Next Question</button>
      <p>Answer wisely…</p>
      <BackButton />
    </div>
  );
};

export default WouldYouStillDate;
