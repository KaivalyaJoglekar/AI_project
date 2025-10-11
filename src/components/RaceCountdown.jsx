import React, { useState, useEffect } from 'react';

export default function RaceCountdown({ onCountdownFinish }) {
  const [lightsOn, setLightsOn] = useState(0);
  const [lightsAreOut, setLightsAreOut] = useState(false);

  useEffect(() => {
    // Phase 1: Turn on the 5 lights sequentially
    if (lightsOn < 5) {
      const timer = setTimeout(() => {
        setLightsOn(current => current + 1);
      }, 800); // Time between each light turning on
      return () => clearTimeout(timer);
    }

    // Phase 2: All lights are on. Pause, then turn them off.
    if (lightsOn === 5 && !lightsAreOut) {
      // Dramatic pause can be random for suspense
      const randomPause = Math.random() * 1000 + 500; // 0.5s to 1.5s
      
      const lightsOutTimer = setTimeout(() => {
        setLightsAreOut(true);
      }, randomPause);

      return () => clearTimeout(lightsOutTimer);
    }

    // Phase 3: Lights are out. Wait a moment, then start the race.
    if (lightsAreOut) {
      const finishTimer = setTimeout(() => {
        onCountdownFinish();
      }, 1500); // How long "LIGHTS OUT!" is displayed

      return () => clearTimeout(finishTimer);
    }

  }, [lightsOn, lightsAreOut, onCountdownFinish]);

  return (
    <div className="countdown-container">
      <div className="lights-grid">
        {[...Array(5)].map((_, i) => (
          // Lights are "on" if their index is less than the current count.
          // If lightsAreOut is true, all lights are off.
          <div key={i} className={`light ${(i < lightsOn && !lightsAreOut) ? 'on' : ''}`} />
        ))}
      </div>
      {lightsAreOut && <h2 className="lights-out-text">LIGHTS OUT!</h2>}
    </div>
  );
}