import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { POINTS_SYSTEM } from '../constants';

const Leaderboard = ({ results, onPlayAgain, onMenu, onContinue, isTournamentRace }) => {
  const [revealedPodium, setRevealedPodium] = useState([]);
  const [showOthers, setShowOthers] = useState(false);

  const sortedResults = [...results].sort((a, b) => a.rank - b.rank);
  const podiumFinishers = sortedResults.slice(0, 3);
  const winner = sortedResults.find(r => r.rank === 1);

  useEffect(() => {
    const timers = [];
    const thirdPlace = podiumFinishers.find(r => r.rank === 3);
    const secondPlace = podiumFinishers.find(r => r.rank === 2);
    const firstPlace = podiumFinishers.find(r => r.rank === 1);

    if (thirdPlace) timers.push(setTimeout(() => setRevealedPodium(prev => [...prev, thirdPlace]), 500));
    if (secondPlace) timers.push(setTimeout(() => setRevealedPodium(prev => [...prev, secondPlace]), 1500));
    if (firstPlace) timers.push(setTimeout(() => setRevealedPodium(prev => [...prev, firstPlace]), 2500));
    
    timers.push(setTimeout(() => setShowOthers(true), 3000));

    return () => timers.forEach(clearTimeout);
  }, []); // Changed dependency to ensure this runs only once on mount

  const getRacerByRank = (rank) => sortedResults.find(r => r.rank === rank);

  return (
    <div className="podium-celebration-container">
      {winner && <Confetti recycle={false} numberOfPieces={800} />}
      
      <div className="podium-main">
        {[getRacerByRank(2), getRacerByRank(1), getRacerByRank(3)].map(racer => {
            if (!racer) return null;
            const isRevealed = revealedPodium.some(p => p.rank === racer.rank);
            const points = POINTS_SYSTEM[racer.rank - 1] || 0;
            return (
                <div key={racer.rank} className={`podium-finisher p${racer.rank} ${isRevealed ? 'reveal' : ''}`}>
                {racer.rank === 1 && <div className="winner-banner">WINNER</div>}
                <div className="podium-racer-name">{racer.name}</div>
                <div className="podium-rank" style={{ color: racer.color }}>{racer.rank}</div>
                <div className="podium-base">
                    {isTournamentRace ? (
                    <div className="podium-points">+{points} PTS</div>
                    ) : (
                    <div className="podium-racer-time">{racer.time}s</div>
                    )}
                </div>
                </div>
            );
        })}
      </div>

      <div className={`results-sidebar ${showOthers ? 'reveal' : ''}`}>
        <h2 className="sidebar-title">Race Results</h2>
        <div className="full-results-list">
          {sortedResults.map(racer => {
            const points = POINTS_SYSTEM[racer.rank - 1] || 0;
            return (
              <div key={racer.rank} className="other-finisher-row">
                <span className="other-rank">{racer.rank}</span>
                <div className="other-name-cell">
                  <span className="driver-color-bar-small" style={{ backgroundColor: racer.color }}></span>
                  <span className="other-name">{racer.name}</span>
                </div>
                {isTournamentRace && <span className="other-time" style={{color: '#a7f3d0'}}>+{points}</span>}
                <span className="other-time">{racer.time}s</span>
              </div>
            );
          })}
        </div>
        <div className="leaderboard-buttons">
          {isTournamentRace ? (
            <button className="game-button" onClick={onContinue}>
              View Standings
            </button>
          ) : (
            <>
              <button className="game-button" onClick={onPlayAgain}>
                Race Again
              </button>
              <button className="game-button" onClick={onMenu}>
                Main Menu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;