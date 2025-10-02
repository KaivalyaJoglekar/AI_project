import React from 'react';

// This component is a direct translation of the code you provided into plain CSS.
export default function AnimatedBackground() {
  return (
    <div className="animated-background">
      {/* Global subtle grid background */}
      <div className="bg-grid" />
      
      {/* Main blobs: blue + yellow */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      
      {/* Subtle grain overlay */}
      <div className="grain-overlay" />
    </div>
  );
}