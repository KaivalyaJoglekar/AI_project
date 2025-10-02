import React from 'react';

const WinnerModal = ({ winner, onPlayAgain, onMenu }) => {
  if (!winner) return null;

  return (
    // This uses the glass-container style but as a modal overlay
    <div className="glass-container" style={{ position: 'absolute', zIndex: 100 }}>
      <h1 className="title">{winner} Wins!</h1>
      <button className="glass-button" onClick={onPlayAgain}>
        Play Again
      </button>
      <button className="glass-button" onClick={onMenu}>
        Main Menu
      </button>
    </div>
  );
};

export default WinnerModal;