import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import Board from './components/Board';
import StartMenu from './components/StartMenu';
import PlayerSetup from './components/PlayerSetup';
import TrackSelection from './components/TrackSelection';
import RaceCountdown from './components/RaceCountdown';
import Leaderboard from './components/Leaderboard';
import { generateMaze } from './maze/generator';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { gbfs } from './algorithms/gbfs';
import { aStar } from './algorithms/aStar';
import { GAME_STATE, BOT_CONFIG, BOT_MOVE_INTERVAL, BOT_SPEED_MIN, BOT_SPEED_MAX, PLAYER_MOVE_COOLDOWN, START_POS, FINISH_POS, TRACKS, MAZE_WIDTH, MAZE_HEIGHT } from './constants';

const algos = { BFS: bfs, DFS: dfs, GBFS: gbfs, 'A*': aStar };
const TOTAL_RACERS = BOT_CONFIG.length + 1;

function App() {
  const [gameState, setGameState] = useState(GAME_STATE.MENU);
  const [maze, setMaze] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const playerInfoRef = useRef({ name: 'You', team: 'Player Team' });
  const selectedTrackRef = useRef(TRACKS[0]);
  const gameTickRef = useRef(0);
  const raceStartTime = useRef(0);
  const playerPosRef = useRef(START_POS);
  const botsRef = useRef([]);
  const playerNextMoveRef = useRef(null);
  const playerLastMoveTime = useRef(0);
  const botsLastMoveTime = useRef(0);
  const playerStepsRef = useRef(0);
  const finishedRacersRef = useRef(new Set());

  // --- THE INPUT FIX: Use a ref to track gameState inside the event listener ---
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const resetGame = useCallback((track) => {
    selectedTrackRef.current = track;
    const newMaze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT, track.complexity);
    setMaze(newMaze);
    setLeaderboardData([]);
    playerPosRef.current = START_POS;
    playerNextMoveRef.current = null;
    playerLastMoveTime.current = 0;
    botsLastMoveTime.current = 0;
    playerStepsRef.current = 0;
    raceStartTime.current = 0;
    gameTickRef.current = 0;
    finishedRacersRef.current.clear();
    // Initialize bots with randomized per-bot move intervals so each bot has different speed
    botsRef.current = BOT_CONFIG.map(config => {
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      return {
        ...config,
        pos: START_POS,
        path: algos[config.name](newMaze, START_POS, FINISH_POS) || [],
        pathIndex: 0,
        // Each bot gets its own move interval (ms). Lower value = faster bot.
        moveInterval: rand(BOT_SPEED_MIN, BOT_SPEED_MAX),
        // Track last move time per bot for precise scheduling
        lastMoveAt: 0,
      };
    });
  }, []);

  // High-Performance Game Loop with separate player and bot speeds
  useEffect(() => {
    if (gameState !== GAME_STATE.PLAYING) return;

    // Hide document scrollbars while playing so arrow keys don't scroll the page
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Set race start time when game begins
    if (raceStartTime.current === 0) {
      raceStartTime.current = Date.now();
    }

    const gameInterval = setInterval(() => {
      gameTickRef.current++;
      const currentTime = Date.now();
      const playerName = playerInfoRef.current.name;
      
      // Update Player (with faster speed)
      const nextMove = playerNextMoveRef.current;
      if (nextMove && !finishedRacersRef.current.has(playerName) && 
          (currentTime - playerLastMoveTime.current >= PLAYER_MOVE_COOLDOWN)) {
        const newPos = { x: playerPosRef.current.x + nextMove.dx, y: playerPosRef.current.y + nextMove.dy };
        if (maze[newPos.y]?.[newPos.x] === 0 || (newPos.x === FINISH_POS.x && newPos.y === FINISH_POS.y)) {
          playerPosRef.current = newPos;
          playerLastMoveTime.current = currentTime;
          playerStepsRef.current++;
        }
        playerNextMoveRef.current = null;
      }
      // Update Bots (each bot moves according to its own moveInterval)
      botsRef.current = botsRef.current.map(bot => {
        if (finishedRacersRef.current.has(bot.name)) return bot;
        const last = bot.lastMoveAt || 0;
        const interval = bot.moveInterval || BOT_MOVE_INTERVAL;
        if (bot.pathIndex < bot.path.length - 1 && (currentTime - last >= interval)) {
          return { ...bot, pos: bot.path[bot.pathIndex + 1], pathIndex: bot.pathIndex + 1, lastMoveAt: currentTime };
        }
        return bot;
      });
      // Check Finishers
      let newFinishers = [];
      const checkFinisher = (racer, pos, color, steps) => {
        if (pos.x === FINISH_POS.x && pos.y === FINISH_POS.y && !finishedRacersRef.current.has(racer)) {
          finishedRacersRef.current.add(racer);
          const elapsedSeconds = ((currentTime - raceStartTime.current) / 1000).toFixed(2);
          newFinishers.push({ rank: finishedRacersRef.current.size, name: racer, time: elapsedSeconds, color, steps });
        }
      };
      checkFinisher(playerName, playerPosRef.current, 'gold', playerStepsRef.current);
      botsRef.current.forEach(bot => checkFinisher(bot.name, bot.pos, bot.color, bot.pathIndex));
      if (newFinishers.length > 0) setLeaderboardData(prev => [...prev, ...newFinishers].sort((a,b) => a.rank - b.rank));
      if (finishedRacersRef.current.size === TOTAL_RACERS) setGameState(GAME_STATE.FINISHED);
      else forceUpdate();
    }, 50); // Run game loop more frequently to handle faster player movement
    return () => {
      clearInterval(gameInterval);
      // Restore previous overflow when leaving PLAYING state
      document.body.style.overflow = prevOverflow;
    };
  }, [gameState, maze]);

  // --- REWRITTEN Player Input Handler for Reliability ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Use the ref here to always get the current game state
      if (gameStateRef.current !== GAME_STATE.PLAYING || playerNextMoveRef.current) {
        return;
      }
      let move = null;
      if (e.key === 'ArrowUp') move = { dx: 0, dy: -1 };
      if (e.key === 'ArrowDown') move = { dx: 0, dy: 1 };
      if (e.key === 'ArrowLeft') move = { dx: -1, dy: 0 };
      if (e.key === 'ArrowRight') move = { dx: 1, dy: 0 };
      
      if (move) {
        e.preventDefault(); // Prevent default browser scrolling behavior
        playerNextMoveRef.current = move;
      }
    };
    // Add the listener once and remove on cleanup. Use passive: false so preventDefault() works reliably.
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown, { passive: false });
  }, []); // Empty dependency array means this effect runs only once

  // UI Action Handlers (Unchanged)
  const handlePlayerSetupComplete = (name, team) => {
    playerInfoRef.current = { name, team };
    setGameState(GAME_STATE.TRACK_SELECTION);
  };
  const handleSelectTrack = (track) => {
    setGameState(GAME_STATE.COUNTDOWN);
    setTimeout(() => { resetGame(track); }, 0);
  };
  const handleCountdownFinish = () => setGameState(GAME_STATE.PLAYING);
  const handlePlayAgain = () => setGameState(GAME_STATE.TRACK_SELECTION);
  const handleMenu = () => setGameState(GAME_STATE.MENU);

  // Render Logic (Unchanged)
  const renderContent = () => {
    switch (gameState) {
      case GAME_STATE.MENU:
        return <StartMenu onPlay={() => setGameState(GAME_STATE.PLAYER_SETUP)} />;
      case GAME_STATE.PLAYER_SETUP:
        return <PlayerSetup onSetupComplete={handlePlayerSetupComplete} onBack={handleMenu} />;
      case GAME_STATE.TRACK_SELECTION:
        return <TrackSelection onSelect={handleSelectTrack} onBack={() => setGameState(GAME_STATE.PLAYER_SETUP)} />;
      case GAME_STATE.COUNTDOWN:
        return <RaceCountdown onCountdownFinish={handleCountdownFinish} />;
      case GAME_STATE.PLAYING:
        return (
          <div className="game-layout">
            <div className="game-header">
              <button className="back-btn" onClick={() => setGameState(GAME_STATE.TRACK_SELECTION)}>
                ← Back to Track Selection
              </button>
              <h1 className="title">{selectedTrackRef.current.name}</h1>
            </div>
            <Board maze={maze} playerPos={playerPosRef.current} bots={botsRef.current} />
            <div className="bot-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: 'gold' }}></div>
                <span>You ({playerInfoRef.current.name})</span>
              </div>
              {BOT_CONFIG.map(bot => (
                <div key={bot.name} className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: bot.color }}></div>
                  <span>{bot.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case GAME_STATE.FINISHED:
        return <Leaderboard results={leaderboardData} onPlayAgain={handlePlayAgain} onMenu={handleMenu} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="game-wrapper">
        {renderContent()}
      </div>
    </>
  );
}

export default App;