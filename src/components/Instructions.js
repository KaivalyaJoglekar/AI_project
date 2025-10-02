import React from 'react';

const Instructions = ({ onBack }) => (
  <div className="glass-container" style={{ maxWidth: '500px' }}>
    <h1 className="title">How to Play</h1>
    <p style={{ lineHeight: '1.6' }}>
      Use the <strong>ARROW KEYS</strong> to drive your gold car to the red finish line.
      You are racing against four AI bots, each using a unique pathfinding algorithm.
      The first one to reach the finish wins!
    </p>
    <button className="glass-button" onClick={onBack}>
      Back to Menu
    </button>
  </div>
);

export default Instructions;