import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const Leaderboard = ({ results, onPlayAgain, onMenu }) => {
  const [revealedPodium, setRevealedPodium] = useState([]);
  const [showOthers, setShowOthers] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const sortedResults = [...results].sort((a, b) => a.rank - b.rank);
  const podiumFinishers = sortedResults.slice(0, 3);

  // This effect now runs ONLY ONCE when the component mounts, fixing the animation bug.
  useEffect(() => {
    const timers = [];
    const thirdPlace = podiumFinishers.find(r => r.rank === 3);
    const secondPlace = podiumFinishers.find(r => r.rank === 2);
    const firstPlace = podiumFinishers.find(r => r.rank === 1);

    // Animation sequence
    if (thirdPlace) timers.push(setTimeout(() => setRevealedPodium(prev => [...prev, thirdPlace]), 500));
    if (secondPlace) timers.push(setTimeout(() => setRevealedPodium(prev => [...prev, secondPlace]), 1500));
    if (firstPlace) {
      timers.push(setTimeout(() => {
        setRevealedPodium(prev => [...prev, firstPlace]);
        setShowConfetti(true); // Trigger confetti for the winner!
      }, 2500));
    }
    timers.push(setTimeout(() => setShowOthers(true), 4000));

    return () => timers.forEach(clearTimeout);
  }, []); // The empty dependency array [] is the crucial fix.

  return (
    <div className="podium-celebration-container">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} tweenDuration={15000} />}
      
      <div className="podium-main">
        {podiumFinishers.map(racer => {
          const isRevealed = revealedPodium.some(p => p.rank === racer.rank);
          return (
            <div key={racer.rank} className={`podium-finisher p${racer.rank} ${isRevealed ? 'reveal' : ''}`}>
              {racer.rank === 1 && <div className="winner-banner">WINNER</div>}
              <div className="podium-racer-name">{racer.name}</div>
              <div className="podium-rank" style={{ color: racer.color }}>{racer.rank}</div>
              <div className="podium-base">
                <div className="podium-racer-time">{racer.time}s</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`results-sidebar ${showOthers ? 'reveal' : ''}`}>
        <h2 className="sidebar-title">Full Standings</h2>
        <div className="full-results-list">
          {sortedResults.map(racer => (
            <div key={racer.rank} className="other-finisher-row">
              <span className="other-rank">{racer.rank}</span>
              <div className="other-name-cell">
                <span className="driver-color-bar-small" style={{ backgroundColor: racer.color }}></span>
                <span className="other-name">{racer.name}</span>
              </div>
              <span className="other-time">{racer.time}s</span>
            </div>
          ))}
        </div>
        <div className="leaderboard-buttons">
          <button className="glass-button primary" onClick={onPlayAgain}>
            Race Again
          </button>
          <button className="glass-button" onClick={onMenu}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;