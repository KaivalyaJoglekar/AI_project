import React, { useRef, useEffect } from 'react';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
};

const ROW_HEIGHT = 48;

const LiveLeaderboard = ({ data, finishedRacers, playerName }) => {
  const prevData = usePrevious(data);

  if (!data || data.length === 0) return null;
  
  const getRankChange = (name) => {
    if (!prevData) return 'none';
    const prev = prevData.find(p => p.name === name);
    const curr = data.find(p => p.name === name);
    if (!prev || !curr) return 'none';
    if (curr.rank < prev.rank) return 'up';
    if (curr.rank > prev.rank) return 'down';
    return 'none';
  };

  // --- THIS IS THE UPDATED LOGIC ---
  // Formats the gap display according to the new rules.
  const formatGap = (racer) => {
    if (finishedRacers.has(racer.name)) return 'Finished';
    if (racer.rank === 1) return 'Leader'; // Only the leader shows "Leader"
    return `+${racer.gap.toFixed(1)}s`; // Everyone else shows time gap to the leader
  };

  return (
    <div className="live-leaderboard-pylon">
      <div className="pylon-body" style={{ height: `${data.length * ROW_HEIGHT}px` }}>
        {data.map((racer) => {
          const rankChange = getRankChange(racer.name);
          const isPlayer = racer.name === playerName;
          const isFinished = finishedRacers.has(racer.name);
          
          return (
            <div
              key={racer.name}
              className={`pylon-row ${isPlayer ? 'player-row' : ''} ${isFinished ? 'finished-row' : ''}`}
              style={{ transform: `translateY(${(racer.rank - 1) * ROW_HEIGHT}px)` }}
            >
              <div className="pylon-pos">
                <span>{racer.rank}</span>
                {rankChange === 'up' && <span className="rank-change rank-up">▲</span>}
                {rankChange === 'down' && <span className="rank-change rank-down">▼</span>}
              </div>
              <div className="pylon-driver">
                <span className="driver-color-bar" style={{ backgroundColor: racer.color }}></span>
                <span className="driver-name">{racer.name}</span>
              </div>
              <div className="pylon-gap">
                {formatGap(racer)}
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill"
                  style={{ width: `${racer.progress * 100}%`, backgroundColor: racer.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveLeaderboard;