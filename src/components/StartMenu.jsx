import React from 'react';

const StartMenu = ({ onPlay }) => (
  <div className="glass-container">
    <h1 className="menu-title">F1 Maze Race</h1>
    <div className="button-group">
      <button className="game-button" onClick={onPlay}>
        Start Race
      </button>
    </div>
  </div>
);

export default StartMenu;