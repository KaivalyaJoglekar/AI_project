import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';

import AnimatedBackground from './components/AnimatedBackground.jsx';
import Board from './components/Board.jsx';
import StartMenu from './components/StartMenu.jsx';
import PlayerSetup from './components/PlayerSetup.jsx';
import TrackSelection from './components/TrackSelection.jsx';
import RaceCountdown from './components/RaceCountdown.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import LiveLeaderboard from './components/LiveLeaderboard.jsx';
import { generateMaze } from './maze/generator.js';
import { bfs } from './algorithms/bfs.js';
import { dfs } from './algorithms/dfs.js';
import { gbfs } from './algorithms/gbfs.js';
import { aStar } from './algorithms/aStar.js';
import { GAME_STATE, BOT_CONFIG, PLAYER_MOVE_COOLDOWN, BOT_SPEED_MIN, BOT_SPEED_MAX, START_POS, FINISH_POS, TRACKS, MAZE_WIDTH, MAZE_HEIGHT } from './constants.js';

const algos = { BFS: bfs, DFS: dfs, GBFS: gbfs, 'A*': aStar };
const TOTAL_RACERS = BOT_CONFIG.length + 1;
const ESTIMATED_RACE_TIME_SECONDS = 45;

function App() {
  const [gameState, setGameState] = useState(GAME_STATE.MENU);
  const [maze, setMaze] = useState([]);
  const [finishedLeaderboard, setFinishedLeaderboard] = useState([]);
  const [liveRaceData, setLiveRaceData] = useState([]);

  // --- NEW ARCHITECTURE: Single Source of Truth for all racers ---
  const racersRef = useRef([]);
  
  const playerInfoRef = useRef({ name: 'You', team: 'Player Team' });
  const selectedTrackRef = useRef(TRACKS[0]);
  const raceStartTime = useRef(0);
  const playerNextMoveRef = useRef(null);
  const finishedRacersRef = useRef(new Set());

  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const resetGame = useCallback((track) => {
    selectedTrackRef.current = track;
    const newMaze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT, track.complexity);
    setMaze(newMaze);
    setFinishedLeaderboard([]);
    setLiveRaceData([]);
    racersRef.current = [];
    playerNextMoveRef.current = null;
    raceStartTime.current = 0;
    finishedRacersRef.current.clear();

    // 1. Initialize Player in the racers array
    const playerPath = algos['A*'](newMaze, START_POS, FINISH_POS) || [];
    racersRef.current.push({
      name: playerInfoRef.current.name,
      color: 'gold',
      pos: START_POS,
      steps: 0,
      isPlayer: true,
      lastMoveTime: 0,
      totalSteps: playerPath.length > 1 ? playerPath.length - 1 : 1,
    });

    // 2. Initialize Bots in the racers array
    BOT_CONFIG.forEach(config => {
      const path = algos[config.name](newMaze, START_POS, FINISH_POS) || [];
      const moveInterval = Math.floor(Math.random() * (BOT_SPEED_MAX - BOT_SPEED_MIN + 1)) + BOT_SPEED_MIN;
      racersRef.current.push({
        ...config,
        pos: START_POS,
        path,
        steps: 0, // 'steps' is now the universal name for pathIndex
        isPlayer: false,
        moveInterval,
        lastMoveTime: 0,
        totalSteps: path.length > 1 ? path.length - 1 : 1,
      });
    });
  }, []);

  useEffect(() => {
    if (gameState !== GAME_STATE.PLAYING) return;
    if (raceStartTime.current === 0) raceStartTime.current = Date.now();

    const gameInterval = setInterval(() => {
      const currentTime = Date.now();

      // --- UNIFIED GAME LOOP ---
      racersRef.current = racersRef.current.map(racer => {
        if (finishedRacersRef.current.has(racer.name)) {
          return racer; // Skip finished racers
        }

        let newRacerState = { ...racer };

        // A. Apply movement logic
        if (racer.isPlayer) {
          const nextMove = playerNextMoveRef.current;
          if (nextMove && currentTime - racer.lastMoveTime >= PLAYER_MOVE_COOLDOWN) {
            const newPos = { x: racer.pos.x + nextMove.dx, y: racer.pos.y + nextMove.dy };
            if (maze[newPos.y]?.[newPos.x] === 0 || (newPos.x === FINISH_POS.x && newPos.y === FINISH_POS.y)) {
              newRacerState.pos = newPos;
              newRacerState.steps++;
              newRacerState.lastMoveTime = currentTime;
            }
            playerNextMoveRef.current = null;
          }
        } else { // It's a bot
          if (currentTime - racer.lastMoveTime >= racer.moveInterval) {
            const newIndex = racer.steps + 1;
            if (newIndex < racer.path.length) {
              newRacerState.pos = racer.path[newIndex];
              newRacerState.steps = newIndex;
              newRacerState.lastMoveTime = currentTime;
            }
          }
        }

        // B. Check if the racer has finished
        if (newRacerState.pos.x === FINISH_POS.x && newRacerState.pos.y === FINISH_POS.y) {
          if (!finishedRacersRef.current.has(racer.name)) {
            finishedRacersRef.current.add(racer.name);
            const elapsedSeconds = ((currentTime - raceStartTime.current) / 1000).toFixed(2);
            const result = { ...racer, time: elapsedSeconds, rank: finishedRacersRef.current.size };
            setFinishedLeaderboard(prev => [...prev, result].sort((a, b) => a.rank - b.rank));
          }
        }
        return newRacerState;
      });

      // --- UNIFIED LIVE LEADERBOARD CALCULATION ---
      const currentStandings = racersRef.current.map(racer => {
        const progress = Math.min(racer.steps / racer.totalSteps, 1);
        const estimatedTime = progress * ESTIMATED_RACE_TIME_SECONDS;
        return { name: racer.name, color: racer.color, progress, estimatedTime, totalSteps: racer.totalSteps };
      }).sort((a, b) => b.progress - a.progress);

      const leaderTime = currentStandings[0]?.estimatedTime || 0;
      setLiveRaceData(currentStandings.map((racer, index) => ({
        ...racer,
        rank: index + 1,
        gap: racer.estimatedTime - leaderTime,
      })));

      // This condition will now fire correctly
      if (finishedRacersRef.current.size === TOTAL_RACERS) {
        setGameState(GAME_STATE.FINISHED);
      }
      
      forceUpdate(); // Re-render the screen
    }, 50);

    return () => clearInterval(gameInterval);
  }, [gameState, maze, resetGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isArrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
      if (!isArrow) return;
      if (gameStateRef.current === GAME_STATE.PLAYING) {
        e.preventDefault();
        if (playerNextMoveRef.current) return;
        let move = null;
        if (e.key === 'ArrowUp') move = { dx: 0, dy: -1 };
        if (e.key === 'ArrowDown') move = { dx: 0, dy: 1 };
        if (e.key === 'ArrowLeft') move = { dx: -1, dy: 0 };
        if (e.key === 'ArrowRight') move = { dx: 1, dy: 0 };
        if (move) playerNextMoveRef.current = move;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false, capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { passive: false, capture: true });
  }, []);

  const handlePlayerSetupComplete = (name, team) => {
    playerInfoRef.current = { name, team };
    setGameState(GAME_STATE.TRACK_SELECTION);
  };
  const handleSelectTrack = (track) => {
    setGameState(GAME_STATE.COUNTDOWN);
    setTimeout(() => resetGame(track), 0);
  };
  const handleCountdownFinish = () => setGameState(GAME_STATE.PLAYING);
  const handlePlayAgain = () => setGameState(GAME_STATE.TRACK_SELECTION);
  const handleMenu = () => setGameState(GAME_STATE.MENU);

  const renderContent = () => {
    // Get player and bots from the single racers array for rendering
    const player = racersRef.current.find(r => r.isPlayer);
    const bots = racersRef.current.filter(r => !r.isPlayer);

    switch (gameState) {
      case GAME_STATE.MENU: return <StartMenu onPlay={() => setGameState(GAME_STATE.PLAYER_SETUP)} />;
      case GAME_STATE.PLAYER_SETUP: return <PlayerSetup onSetupComplete={handlePlayerSetupComplete} onBack={handleMenu} />;
      case GAME_STATE.TRACK_SELECTION: return <TrackSelection onSelect={handleSelectTrack} onBack={() => setGameState(GAME_STATE.PLAYER_SETUP)} />;
      case GAME_STATE.COUNTDOWN: return <RaceCountdown onCountdownFinish={handleCountdownFinish} />;
      case GAME_STATE.PLAYING:
        return (
          <div className="race-ui-container">
            <div className="race-header">
              <button className="back-btn" onClick={() => setGameState(GAME_STATE.TRACK_SELECTION)}>← Back to Track Selection</button>
              <h1 className="title race-title">{selectedTrackRef.current.name}</h1>
            </div>
            <div className="race-main-content">
              {/* Pass player and bots derived from the single ref */}
              <Board maze={maze} playerPos={player?.pos || START_POS} bots={bots} />
              <LiveLeaderboard data={liveRaceData} finishedRacers={finishedRacersRef.current} playerName={playerInfoRef.current.name} />
            </div>
          </div>
        );
      case GAME_STATE.FINISHED: return <Leaderboard results={finishedLeaderboard} onPlayAgain={handlePlayAgain} onMenu={handleMenu} />;
      default: return null;
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className={gameState === GAME_STATE.PLAYING ? "" : "game-wrapper"}>
        {renderContent()}
      </div>
    </>
  );
}

export default App;