import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Happy Birthday!</h1>
      <Link to="/cake"><button>Blow Out the Cake</button></Link>
      <Link to="/would-you-still-date"><button>Would You Still Date Me If…</button></Link>
      <Link to="/compliments"><button>Compliment Machine</button></Link>
    </div>
  );
};

export default Home;
