import React from 'react';
import Squares from './Squares';
import './Squares.css';

export default function AnimatedBackground() {
  return (
    <div className="animated-background">
      <Squares 
        speed={0.3} 
        squareSize={100} 
        direction='down'
        borderColor='rgba(255, 255, 255, 0.08)' 
        hoverFillColor='rgba(255, 255, 255, 0.05)'
        dotted={true}
      />
      
      {/* Reverted to the original four blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />

      <div className="grain-overlay" />
    </div>
  );
}