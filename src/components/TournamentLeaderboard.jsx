import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

export default function TournamentLeaderboard({ standings, allRaceResults, tracks, onPlayAgain, onMenu }) {
  const [revealedPodium, setRevealedPodium] = useState([]);
  const [showOthers, setShowOthers] = useState(false);
  const [selectedRace, setSelectedRace] = useState(0);

  const sortedStandings = [...standings].sort((a, b) => b.points - a.points);
  const podiumFinishers = sortedStandings.slice(0, 3);
  const winner = podiumFinishers.find(p => p.rank === 1);

  useEffect(() => {
    const timers = [];
    const thirdPlace = podiumFinishers.find(p => p.rank === 3);
    const secondPlace = podiumFinishers.find(p => p.rank === 2);

    if (thirdPlace) timers.push(setTimeout(() => setRevealedPodium(prev => [...prev, thirdPlace]), 500));
    if (secondPlace) timers.push(setTimeout(() => setRevealedPodium(prev => [...prev, secondPlace]), 1500));
    if (winner) timers.push(setTimeout(() => setRevealedPodium(prev => [...prev, winner]), 2500));
    timers.push(setTimeout(() => setShowOthers(true), 4000));

    return () => timers.forEach(clearTimeout);
  }, []);

  const getRacerByRank = (rank) => {
    const racer = sortedStandings[rank - 1];
    if (racer) racer.rank = rank;
    return racer;
  };
  
  const selectedRaceResults = allRaceResults[selectedRace].sort((a, b) => a.rank - b.rank);

  return (
    <div className="podium-celebration-container">
      {winner && <Confetti recycle={false} numberOfPieces={600} gravity={0.2} />}
      
      <div className="podium-main">
        {[getRacerByRank(2), getRacerByRank(1), getRacerByRank(3)].map(racer => {
          if (!racer) return null;
          const isRevealed = revealedPodium.some(p => p.rank === racer.rank);
          return (
            <div key={racer.rank} className={`podium-finisher p${racer.rank} ${isRevealed ? 'reveal' : ''}`}>
              {racer.rank === 1 && <div className="winner-banner">CHAMPION</div>}
              <div className="podium-racer-name">{racer.name}</div>
              <div className="podium-rank" style={{ color: racer.color }}>{racer.rank}</div>
              <div className="podium-base">
                <div className="podium-points">{racer.points} PTS</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`results-sidebar ${showOthers ? 'reveal' : ''}`}>
        <h2 className="sidebar-title">Race Statistics</h2>
        {/* Race Selection Tabs */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
            {tracks.map((track, index) => (
                <button key={track.name} onClick={() => setSelectedRace(index)}
                  style={{
                    flex: 1, padding: '8px', border: 'none', borderRadius: '5px',
                    background: selectedRace === index ? '#E10600' : '#333',
                    color: 'white', cursor: 'pointer'
                  }}
                >{`R${index + 1}`}</button>
            ))}
        </div>
        <h3 style={{textAlign: 'center', margin: '0 0 10px 0'}}>{tracks[selectedRace].name}</h3>
        <div className="full-results-list">
          {selectedRaceResults.map(racer => (
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
          {/* --- FIX: Changed class from "f1-button" to "game-button" --- */}
          <button className="game-button" onClick={onPlayAgain}>Play Again</button>
          <button className="game-button" onClick={onMenu}>Main Menu</button>
        </div>
      </div>
    </div>
  );
};