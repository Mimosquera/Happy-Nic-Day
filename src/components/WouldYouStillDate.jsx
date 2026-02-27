import React, { useState } from 'react';
import BackButton from './BackButton';

const questions = [
  "Would you still date me if I was a worm?",
  "Would you still date me if I barked instead of talked?",
  "Would you still date me if I only wore Crocs?",
  "Would you still date me if I turned into Shrek every night?",
  "Would you still date me if I laughed like a dolphin?",
  "Would you still date me if I only spoke in riddles?",
  "Would you still date me if I replaced all furniture with trampolines?",
  "Would you still date me if I believed every pigeon was spying on me?",
  "Would you still date me if I had a tail like a squirrel?",
  "Would you still date me if I made sound effects for everything I did?",
  "Would you still date me if I couldn’t stop quoting TikToks?",
  "Would you still date me if I had a pet rock named Señor Pebble?",
  "Would you still date me if I made you call me ‘Captain Cuddles’ in public?",
  "Would you still date me if I wore a cloak and spoke in rhymes?",
  "Would you still date me if I turned every serious conversation into a rap battle?",
  "Would you still date me if I only ate purple foods?",
  "Would you still date me if I insisted on narrating my life in a British accent?",
  "Would you still date me if I gave names to all my socks and spoke to them?",
  "Would you still date me if I had a framed photo of Nicolas Cage in every room?",
  "Would you still date me if I thought I was part mermaid and insisted on bath time every day?",
  "Would you still date me if I challenged random strangers to dance battles?",
  "Would you still date me if I believed we were in a secret musical and sang everything?",
  "Would you still date me if I made friendship bracelets for my houseplants?",
  "Would you still date me if I got matching tattoos with a squirrel?",
  "Would you still date me if I refused to walk and demanded piggyback rides everywhere?",
  "Would you still date me if I had a plushie collection that I made sleep in formation?",
  "Would you still date me if I wore vampire fangs year-round?",
  "Would you still date me if I reenacted movie scenes every time we had an argument?",
  "Would you still date me if I cried during cute dog videos every day?",
  "Would you still date me if I introduced myself as 'your problem' to strangers?",
  "Would you still date me if I were a turtle?",
  "Would you still date me if I were a tortoise?",
];


function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const WouldYouStillDate = () => {
  // Lazy initialiser — shuffled immediately so first render always has a question
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffleArray(questions));
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  const nextQuestion = () => {
    if (index < shuffledQuestions.length - 1) {
      setIndex(index + 1);
    } else {
      setShuffledQuestions(shuffleArray(questions));
      setIndex(0);
    }
    setFadeKey(prev => prev + 1);
  };

  return (
    <div className="page">
      <h1>Answer wisely…</h1>
      <img
        src="/heart-key.png"
        alt="heart with key"
        className="page-img"
      />
      <button className="btn-sm" onClick={nextQuestion}>Next Question 💭</button>
      <p key={fadeKey} className="fade-in question-text">{shuffledQuestions[index]}</p>
      <BackButton />
      <footer className="year-footer">2025</footer>
    </div>
  );
};

export default WouldYouStillDate;