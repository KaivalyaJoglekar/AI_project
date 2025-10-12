import React from 'react';

export default function TournamentStandings({ standings, raceNum, totalRaces, onNextRace }) {
  // Sort standings by points
  const sortedStandings = [...standings].sort((a, b) => b.points - a.points);

  return (
    <div className="glass-container" style={{ width: '500px' }}>
      <h1 className="title">Championship Standings</h1>
      <h2 style={{ opacity: 0.8, marginTop: '-15px', marginBottom: '30px' }}>
        After Race {raceNum} of {totalRaces}
      </h2>
      <div className="full-results-list" style={{ maxHeight: '300px' }}>
        {sortedStandings.map((racer, index) => (
          <div key={racer.name} className="other-finisher-row">
            <span className="other-rank">{index + 1}</span>
            <div className="other-name-cell">
              <span className="driver-color-bar-small" style={{ backgroundColor: racer.color }}></span>
              <span className="other-name">{racer.name}</span>
            </div>
            <span className="other-time" style={{ color: '#fff', fontWeight: 'bold' }}>{racer.points} PTS</span>
          </div>
        ))}
      </div>
      <div className="leaderboard-buttons">
        <button className="game-button" onClick={onNextRace}>
          Continue to Next Race
        </button>
      </div>
    </div>
  );
}