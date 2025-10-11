import React from 'react';

export default function TournamentSetup({ onSelect, onBack }) {
  return (
    <div className="glass-container">
      <h1 className="menu-title">Tournament</h1>
      <div className="button-group">
        <button className="game-button" onClick={() => onSelect(3)}>
          3 Race Championship
        </button>
        <button className="game-button" onClick={() => onSelect(5)}>
          5 Race Championship
        </button>
        <button className="game-button" onClick={onBack} style={{marginTop: '10px'}}>
          Back
        </button>
      </div>
    </div>
  );
}