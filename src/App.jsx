import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CakePage from './components/CakePage';
import WouldYouStillDate from './components/WouldYouStillDate';
import ComplimentMachine from './components/ComplimentMachine';
import MicTest from './components/MicTest';


function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cake" element={<CakePage />} />
        <Route path="/would-you-still-date" element={<WouldYouStillDate />} />
        <Route path="/compliments" element={<ComplimentMachine />} />
        <Route path="/mic-test" element={<MicTest />} />
      </Routes>
  );
}

export default App;
