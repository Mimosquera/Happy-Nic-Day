import React, { useState } from 'react';
import BackButton from './BackButton';

const questions = [
  "I was a worm?",
  "I barked instead of talked?",
  "I only wore Crocs?",
  "I turned into Shrek every night?",
  "I laughed like a dolphin?",
  "I only spoke in riddles?",
  "I replaced all furniture with trampolines?",
  "I believed every pigeon was spying on me?",
  "I had a tail like a squirrel?",
  "I made sound effects for everything I did?",
  "I couldn’t stop quoting TikToks?",
  "I had a pet rock named Señor Pebble?",
  "I made you call me ‘Captain Cuddles’ in public?",
  "I wore a cloak and spoke in rhymes?",
  "I turned every serious conversation into a rap battle?",
  "I only ate purple foods?",
  "I insisted on narrating my life in a British accent?",
  "I gave names to all my socks and spoke to them?",
  "I had a framed photo of Nicolas Cage in every room?",
  "I thought I was part mermaid and insisted on bath time every day?",
  "I challenged random strangers to dance battles?",
  "I believed we were in a secret musical and sang everything?",
  "I made friendship bracelets for my houseplants?",
  "I got matching tattoos with a squirrel?",
  "I refused to walk and demanded piggyback rides everywhere?",
  "I had a plushie collection that I made sleep in formation?",
  "I wore vampire fangs year-round?",
  "I reenacted movie scenes every time we had an argument?",
  "I cried during cute dog videos every day?",
  "I introduced myself as ‘your problem’ to strangers?",
  "I were a turtle?",
  "I were a tortoise?",
];


function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const WouldYouStillDate = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffle(questions));
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  const nextQuestion = () => {
    if (index < shuffledQuestions.length - 1) {
      setIndex(index + 1);
    } else {
      setShuffledQuestions(shuffle(questions));
      setIndex(0);
    }
    setFadeKey(prev => prev + 1);
  };

  return (
    <div className="page would-you-still-date">
      <h1>Would you still<br />date me if...</h1>
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