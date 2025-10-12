import React from 'react';

export default function ModeSelection({ onSelect, onBack }) {
  return (
    <div className="glass-container" style={{width: '350px'}}>
      <h1 className="menu-title">Select Mode</h1>
      <div className="button-group">
        <button className="game-button" onClick={() => onSelect('single')}>
          Single Race
        </button>
        <button className="game-button" onClick={() => onSelect('tournament')}>
          Tournament
        </button>
        <button className="game-button" onClick={onBack} style={{marginTop: '10px'}}>
          Back
        </button>
      </div>
    </div>
  );
}