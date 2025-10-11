import React from 'react';

const StartMenu = ({ onPlay }) => (
  <div className="glass-container">
    <h1 className="title">F1 Maze Race</h1>
    <button className="glass-button" onClick={onPlay}>
      Start Race
    </button>
  </div>
);

export default StartMenu;