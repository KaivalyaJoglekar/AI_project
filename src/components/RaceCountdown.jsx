import React, { useState, useEffect } from 'react';

export default function RaceCountdown({ onCountdownFinish }) {
  const [lights, setLights] = useState(0);

  useEffect(() => {
    if (lights < 5) {
      const timer = setTimeout(() => setLights(l => l + 1), 700);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => onCountdownFinish(), 800);
      return () => clearTimeout(finishTimer);
    }
  }, [lights, onCountdownFinish]);

  return (
    <div className="glass-container countdown-container">
      <div className="lights-grid">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`light ${i < lights ? 'on' : ''}`} />
        ))}
      </div>
      {lights === 5 && <h2 className="lights-out-text">LIGHTS OUT!</h2>}
    </div>
  );
}