import React, { useState } from 'react';

export default function PlayerSetup({ onSetupComplete, onBack }) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && team) {
      onSetupComplete(name, team);
    }
  };

  return (
    <div className="glass-container">
      <h1 className="title">Driver Profile</h1>
      <form onSubmit={handleSubmit} className="player-setup-form">
        <div className="form-group">
          <label htmlFor="username">Driver Name</label>
          <input
            id="username"
            type="text"
            className="input-field"
            placeholder="e.g., Max"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            maxLength="12"
          />
        </div>
        <div className="form-group">
          <label htmlFor="team">Team Name</label>
          <input
            id="team"
            type="text"
            className="input-field"
            placeholder="e.g., Red Bull"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            autoComplete="off"
            maxLength="15"
          />
        </div>
        <div className="form-buttons">
          <button type="button" className="glass-button" onClick={onBack}>Back</button>
          <button type="submit" className="glass-button" disabled={!name || !team}>
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}