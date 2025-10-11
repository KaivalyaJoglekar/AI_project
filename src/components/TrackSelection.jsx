import React, { useState } from 'react';
import { TRACKS } from '../constants';

const shuffleTracks = (arr) => [...arr].sort(() => 0.5 - Math.random());

export default function TrackSelection({ onSelect, onBack, mode = 'single', raceCount = 1 }) {
  const [selected, setSelected] = useState([]);

  const handleSelectTrack = (track) => {
    if (mode === 'single') {
      onSelect(track);
      return;
    }
    const isAlreadySelected = selected.find(t => t.name === track.name);
    let newSelected;
    if (isAlreadySelected) {
      newSelected = selected.filter(t => t.name !== track.name);
    } else if (selected.length < raceCount) {
      newSelected = [...selected, track];
    } else {
      return;
    }
    setSelected(newSelected);
  };

  const handleRandom = () => {
    if (mode === 'single') {
      const randomTrack = TRACKS[Math.floor(Math.random() * TRACKS.length)];
      onSelect(randomTrack);
    } else {
      const randomTracks = shuffleTracks(TRACKS).slice(0, raceCount);
      setSelected(randomTracks);
    }
  };

  const renderTournamentButtons = () => {
    if (mode !== 'tournament') return null;
    const isSelectionComplete = selected.length === raceCount;
    return (
      <button
        className="game-button"
        onClick={() => onSelect(selected)}
        disabled={!isSelectionComplete}
      >
        Start Championship
      </button>
    );
  };

  return (
    <div className="track-selection-page">
      <h1 className="title">Select a Circuit</h1>
      {mode === 'tournament' && (
        <h2 style={{ opacity: 0.8, marginTop: '-15px', marginBottom: '30px' }}>
          Selected {selected.length} of {raceCount}
        </h2>
      )}
      <div className="track-cards-container">
        {TRACKS.map(track => {
          const isSelected = selected.find(t => t.name === track.name);
          return (
            <div
              key={track.name}
              className={`track-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectTrack(track)}
            >
              <div className="track-info">
                <h2 className="track-name">
                  <span className="track-flag">{track.flag}</span>
                  {track.name}
                </h2>
                <p className="track-description">{track.description}</p>
              </div>
              <img src={track.image} alt="" className="track-image-decoration" />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%', maxWidth: '800px'}}>
        <button className="game-button" onClick={onBack}>Back</button>
        <button className="game-button" onClick={handleRandom}>
          {mode === 'single' ? 'Random Track' : `Randomize`}
        </button>
        {renderTournamentButtons()}
      </div>
    </div>
  );
}