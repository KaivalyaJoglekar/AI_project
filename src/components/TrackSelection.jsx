import React from 'react';
import { TRACKS } from '../constants';

export default function TrackSelection({ onSelect, onBack }) {
  return (
    <div className="track-selection-container">
      <div className="glass-container">
        <h1 className="title">Select a Circuit</h1>
        <div className="track-cards-container">
          {TRACKS.map(track => (
            <div key={track.name} className="track-card" onClick={() => onSelect(track)}>
              <h2 className="track-name">
                {/* Display the flag emoji */}
                <span className="track-flag">{track.flag}</span>
                {track.name}
              </h2>
              <p className="track-description">{track.description}</p>
            </div>
          ))}
        </div>
        <button className="glass-button" onClick={onBack}>Back to Menu</button>
      </div>
    </div>
  );
}