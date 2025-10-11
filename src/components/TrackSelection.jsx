import React from 'react';
import { TRACKS } from '../constants';

export default function TrackSelection({ onSelect, onBack }) {
  return (
    <div className="track-selection-page">
      <h1 className="title">Select a Circuit</h1>
      <div className="track-cards-container">
        {TRACKS.map(track => (
          <div key={track.name} className="track-card" onClick={() => onSelect(track)}>
            <div className="track-info">
              <h2 className="track-name">
                <span className="track-flag">{track.flag}</span>
                {track.name}
              </h2>
              <p className="track-description">{track.description}</p>
            </div>
            {/* The track layout image is now a decorative element */}
            <img src={track.image} alt="" className="track-image-decoration" />
          </div>
        ))}
      </div>
      <button className="dark-button" onClick={onBack}>Back to Menu</button>
    </div>
  );
}