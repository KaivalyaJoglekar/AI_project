import React, { useRef, useEffect } from 'react';

// A custom hook to store the previous value of a prop or state
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Constants for styling
const ROW_HEIGHT = 40; // The height of each racer's row in pixels

const LiveLeaderboard = ({ data, playerName }) => {
  const prevData = usePrevious(data);

  if (!data || data.length === 0) {
    return null;
  }
  
  const getRankChange = (name) => {
    if (!prevData) return 'none';
    const prevRacer = prevData.find(p => p.name === name);
    const currentRacer = data.find(p => p.name === name);
    if (!prevRacer || !currentRacer) return 'none';

    if (currentRacer.rank < prevRacer.rank) return 'up';
    if (currentRacer.rank > prevRacer.rank) return 'down';
    return 'none';
  };

  const getGap = (index) => {
    if (index === 0) {
      // Leader is at the front
      return 'Interval';
    }
    const leaderProgress = data[0].progress;
    const currentProgress = data[index].progress;
    // Estimate gap in seconds. Assuming a 40-second lap/race for calculation.
    const gapSeconds = (leaderProgress - currentProgress) * 40;
    return `+${gapSeconds.toFixed(1)}s`;
  };

  return (
    <div className="live-leaderboard-pylon">
      <div className="pylon-header">
        <span>POS</span>
        <span>DRIVER</span>
        <span>GAP</span>
      </div>
      <div className="pylon-body" style={{ height: `${data.length * ROW_HEIGHT}px` }}>
        {data.map((racer, index) => {
          const rankChange = getRankChange(racer.name);
          const isPlayer = racer.name === playerName;
          
          return (
            <div
              key={racer.name}
              className={`racer-row ${isPlayer ? 'player-row' : ''}`}
              style={{ transform: `translateY(${(racer.rank - 1) * ROW_HEIGHT}px)` }}
            >
              <div className="racer-pos">
                <span>{racer.rank}</span>
                {rankChange === 'up' && <span className="rank-change rank-up">▲</span>}
                {rankChange === 'down' && <span className="rank-change rank-down">▼</span>}
              </div>
              <div className="racer-name">
                <span className="color-bar" style={{ backgroundColor: racer.color }}></span>
                {racer.name}
              </div>
              <div className="racer-gap">
                {getGap(index)}
              </div>
              <div 
                className="progress-bar-bg"
                style={{ width: `${racer.progress * 100}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveLeaderboard;