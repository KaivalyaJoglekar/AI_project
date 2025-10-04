import React from 'react';

export default function Leaderboard({ results, onPlayAgain, onMenu }) {
  return (
    <div className="glass-container leaderboard-container">
      <h1 className="title">Race Results</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Racer</th>
            <th>Steps</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.name}>
              <td>{result.rank}</td>
              <td style={{ color: result.color || 'gold' }}>{result.name}</td>
              <td>{result.steps}</td>
              <td>{result.time}s</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="leaderboard-buttons">
        <button className="glass-button" onClick={onPlayAgain}>Play Again</button>
        <button className="glass-button" onClick={onMenu}>Main Menu</button>
      </div>
    </div>
  );
}