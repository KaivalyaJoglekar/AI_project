import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';

import AnimatedBackground from './components/AnimatedBackground.jsx';
import Board from './components/Board.jsx';
import StartMenu from './components/StartMenu.jsx';
import PlayerSetup from './components/PlayerSetup.jsx';
import ModeSelection from './components/ModeSelection.jsx';
import TournamentSetup from './components/TournamentSetup.jsx';
import TrackSelection from './components/TrackSelection.jsx';
import RaceCountdown from './components/RaceCountdown.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import TournamentStandings from './components/TournamentStandings.jsx';
import TournamentLeaderboard from './components/TournamentLeaderboard.jsx';
import LiveLeaderboard from './components/LiveLeaderboard.jsx';
import AudioToggle from './components/AudioToggle.jsx'; // <-- 1. IMPORT the new component
import { generateMaze } from './maze/generator.js';
import { bfs } from './algorithms/bfs.js';
import { dfs } from './algorithms/dfs.js';
import { gbfs } from './algorithms/gbfs.js';
import { aStar } from './algorithms/aStar.js';
import { GAME_STATE, BOT_CONFIG, PLAYER_MOVE_COOLDOWN, BOT_SPEED_MIN, BOT_SPEED_MAX, START_POS, FINISH_POS, TRACKS, MAZE_WIDTH, MAZE_HEIGHT, POINTS_SYSTEM } from './constants.js';

const algos = { BFS: bfs, DFS: dfs, GBFS: gbfs, 'A*': aStar };
const TOTAL_RACERS = BOT_CONFIG.length + 1;

function App() {
  const [gameState, setGameState] = useState(GAME_STATE.MENU);
  const [maze, setMaze] = useState([]);
  const [finishedLeaderboard, setFinishedLeaderboard] = useState([]);
  const [liveRaceData, setLiveRaceData] = useState([]);
  const [isAudioRequested, setIsAudioRequested] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true); // <-- 2. ADD new state for audio toggle

  const racersRef = useRef([]);
  const playerInfoRef = useRef({ name: 'You', team: 'Player Team' });
  const selectedTrackRef = useRef(TRACKS[0]);
  const raceStartTime = useRef(0);
  const playerNextMoveRef = useRef(null);
  const finishedRacersRef = useRef(new Set());
  const tournamentData = useRef(null);
  const audioRef = useRef(null);

  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleStartGame = () => {
    if (!isAudioRequested) {
      setIsAudioRequested(true);
    }
    setGameState(GAME_STATE.PLAYER_SETUP);
  };

  // --- 3. ADD a handler for the toggle button ---
  const handleAudioToggle = () => {
    setIsAudioEnabled(prevState => !prevState);
  };
  // ---------------------------------------------

  // --- 4. UPDATE the audio useEffect to respect the toggle ---
  useEffect(() => {
    // Initialize the Audio object on the first user interaction
    if (isAudioRequested && !audioRef.current) {
      audioRef.current = new Audio('/f1.mp3'); // Assumes f1.mp3 is in /public
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }

    // Control playback based on the isAudioEnabled state
    if (audioRef.current) {
      if (isAudioEnabled) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }

    // Cleanup function to pause audio when the app closes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isAudioRequested, isAudioEnabled]); // The effect now runs when the toggle state changes
  // --------------------------------------------------------

  const startRace = useCallback((track) => {
    selectedTrackRef.current = track;
    const newMaze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT, track.complexity);
    setMaze(newMaze);
    setFinishedLeaderboard([]);
    setLiveRaceData([]);
    racersRef.current = [];
    playerNextMoveRef.current = null;
    raceStartTime.current = 0;
    finishedRacersRef.current.clear();

    const playerPath = algos['A*'](newMaze, START_POS, FINISH_POS) || [];
    racersRef.current.push({
      name: playerInfoRef.current.name,
      color: 'gold',
      pos: START_POS,
      path: [],
      steps: 0,
      isPlayer: true,
      lastMoveTime: 0,
      totalSteps: playerPath.length > 1 ? playerPath.length - 1 : 1,
    });

    BOT_CONFIG.forEach(config => {
      const path = algos[config.name](newMaze, START_POS, FINISH_POS) || [];
      const moveInterval = Math.floor(Math.random() * (BOT_SPEED_MAX - BOT_SPEED_MIN + 1)) + BOT_SPEED_MIN;
      racersRef.current.push({
        ...config,
        pos: START_POS,
        path,
        steps: 0,
        isPlayer: false,
        moveInterval,
        lastMoveTime: 0,
        totalSteps: path.length > 1 ? path.length - 1 : 1,
      });
    });

    setGameState(GAME_STATE.COUNTDOWN);
  }, []);

  const handleEndOfRace = useCallback(() => {
    setGameState(GAME_STATE.FINISHED);
  }, []);

  useEffect(() => {
    if (gameState !== GAME_STATE.PLAYING) return;
    if (raceStartTime.current === 0) raceStartTime.current = Date.now();

    const gameInterval = setInterval(() => {
      const currentTime = Date.now();
      let hasEveryoneFinished = finishedRacersRef.current.size === TOTAL_RACERS;

      if (!hasEveryoneFinished) {
          racersRef.current = racersRef.current.map(racer => {
            if (finishedRacersRef.current.has(racer.name)) return racer;
            let newRacerState = { ...racer };
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
            } else {
              if (currentTime - racer.lastMoveTime >= racer.moveInterval) {
                const newIndex = racer.steps + 1;
                if (newIndex < racer.path.length) {
                  newRacerState.pos = racer.path[newIndex];
                  newRacerState.steps = newIndex;
                  newRacerState.lastMoveTime = currentTime;
                }
              }
            }
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

          const elapsedTimeSeconds = (currentTime - raceStartTime.current) / 1000;
          const currentStandings = racersRef.current.map(racer => ({
            name: racer.name,
            color: racer.color,
            progress: Math.min(racer.steps / racer.totalSteps, 1),
            isFinished: finishedRacersRef.current.has(racer.name),
          })).sort((a, b) => {
            if (a.isFinished && !b.isFinished) return -1;
            if (!a.isFinished && b.isFinished) return 1;
            return b.progress - a.progress;
          });
          const leaderProgress = currentStandings[0]?.progress || 0;
          setLiveRaceData(currentStandings.map((racer, index) => {
            let gap = 0;
            if (index > 0 && leaderProgress > 0 && !racer.isFinished) {
              const progressDeficit = leaderProgress - racer.progress;
              const timePerUnitOfProgress = elapsedTimeSeconds / leaderProgress;
              gap = progressDeficit * timePerUnitOfProgress;
            }
            return { ...racer, rank: index + 1, gap };
          }));
      }

      if (finishedRacersRef.current.size === TOTAL_RACERS) {
        clearInterval(gameInterval);
        setTimeout(handleEndOfRace, 1000);
      }

      forceUpdate();
    }, 50);

    return () => clearInterval(gameInterval);
  }, [gameState, maze, handleEndOfRace]);

  const handleTournamentPodiumContinue = () => {
    const standings = tournamentData.current.scores;
    finishedLeaderboard.forEach(racer => {
      const points = POINTS_SYSTEM[racer.rank - 1] || 0;
      const currentRacer = standings.find(s => s.name === racer.name);
      if (currentRacer) {
        currentRacer.points += points;
      }
    });

    tournamentData.current.allRaceResults.push(finishedLeaderboard);
    tournamentData.current.currentRaceIndex++;

    if (tournamentData.current.currentRaceIndex < tournamentData.current.tracks.length) {
      setGameState(GAME_STATE.TOURNAMENT_STANDINGS);
    } else {
      setGameState(GAME_STATE.TOURNAMENT_FINISHED);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isArrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
      if (!isArrow || gameStateRef.current !== GAME_STATE.PLAYING) return;
      e.preventDefault();
      if (playerNextMoveRef.current) return;
      let move = null;
      if (e.key === 'ArrowUp') move = { dx: 0, dy: -1 };
      if (e.key === 'ArrowDown') move = { dx: 0, dy: 1 };
      if (e.key === 'ArrowLeft') move = { dx: -1, dy: 0 };
      if (e.key === 'ArrowRight') move = { dx: 1, dy: 0 };
      if (move) playerNextMoveRef.current = move;
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false, capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { passive: false, capture: true });
  }, []);

  const handlePlayerSetupComplete = (name, team) => {
    playerInfoRef.current = { name, team };
    setGameState(GAME_STATE.MODE_SELECTION);
  };

  const handleModeSelect = (mode) => {
    if (mode === 'single') {
      tournamentData.current = null;
      setGameState(GAME_STATE.TRACK_SELECTION);
    } else {
      setGameState(GAME_STATE.TOURNAMENT_SETUP);
    }
  };

  const handleTournamentSetup = (raceCount) => {
    const allRacers = [
      { name: playerInfoRef.current.name, color: 'gold' },
      ...BOT_CONFIG
    ];
    tournamentData.current = {
      tracks: [],
      raceCount: raceCount,
      currentRaceIndex: 0,
      scores: allRacers.map(r => ({ name: r.name, color: r.color, points: 0 })),
      allRaceResults: [],
    };
    setGameState(GAME_STATE.TOURNAMENT_TRACK_SELECTION);
  };

  const handleTrackSelectionComplete = (tracks) => {
    if (Array.isArray(tracks)) {
      tournamentData.current.tracks = tracks;
      startRace(tracks[0]);
    } else {
      startRace(tracks);
    }
  };

  const handleNextRace = () => {
    const nextTrack = tournamentData.current.tracks[tournamentData.current.currentRaceIndex];
    startRace(nextTrack);
  };

  const handlePlayAgain = () => {
    tournamentData.current = null;
    setGameState(GAME_STATE.MODE_SELECTION);
  };
  const handleMenu = () => {
    tournamentData.current = null;
    setGameState(GAME_STATE.MENU);
  };

  const renderContent = () => {
    const player = racersRef.current.find(r => r.isPlayer);
    const bots = racersRef.current.filter(r => !r.isPlayer);
    switch (gameState) {
      case GAME_STATE.MENU: return <StartMenu onPlay={handleStartGame} />;
      case GAME_STATE.PLAYER_SETUP: return <PlayerSetup onSetupComplete={handlePlayerSetupComplete} onBack={handleMenu} />;
      case GAME_STATE.MODE_SELECTION: return <ModeSelection onSelect={handleModeSelect} onBack={() => setGameState(GAME_STATE.PLAYER_SETUP)} />;
      case GAME_STATE.TOURNAMENT_SETUP: return <TournamentSetup onSelect={handleTournamentSetup} onBack={() => setGameState(GAME_STATE.MODE_SELECTION)} />;
      case GAME_STATE.TRACK_SELECTION: return <TrackSelection onSelect={handleTrackSelectionComplete} onBack={() => setGameState(GAME_STATE.MODE_SELECTION)} mode="single" />;
      case GAME_STATE.TOURNAMENT_TRACK_SELECTION: return <TrackSelection onSelect={handleTrackSelectionComplete} onBack={() => setGameState(GAME_STATE.TOURNAMENT_SETUP)} mode="tournament" raceCount={tournamentData.current?.raceCount} />;
      case GAME_state.COUNTDOWN: return <RaceCountdown onCountdownFinish={() => setGameState(GAME_STATE.PLAYING)} />;
      case GAME_STATE.PLAYING:
        const title = tournamentData.current ? `${selectedTrackRef.current.name} (${tournamentData.current.currentRaceIndex + 1}/${tournamentData.current.raceCount})` : selectedTrackRef.current.name;
        return (
          <div className="race-ui-container">
            <div className="race-header">
              <h1 className="title race-title">{title}</h1>
            </div>
            <div className="race-main-content">
              <Board maze={maze} playerPos={player?.pos || START_POS} bots={bots} />
              <div className="race-sidebar">
                <div className="live-track-map">
                  <img src={selectedTrackRef.current.image} alt={`${selectedTrackRef.current.name} map`} />
                </div>
                <LiveLeaderboard data={liveRaceData} finishedRacers={finishedRacersRef.current} playerName={playerInfoRef.current.name} />
              </div>
            </div>
          </div>
        );
      case GAME_STATE.FINISHED: return <Leaderboard results={finishedLeaderboard} onPlayAgain={handlePlayAgain} onMenu={handleMenu} onContinue={handleTournamentPodiumContinue} isTournamentRace={!!tournamentData.current} />;
      case GAME_STATE.TOURNAMENT_STANDINGS: return <TournamentStandings standings={tournamentData.current.scores} raceNum={tournamentData.current.currentRaceIndex} totalRaces={tournamentData.current.raceCount} onNextRace={handleNextRace} />;
      case GAME_STATE.TOURNAMENT_FINISHED: return <TournamentLeaderboard standings={tournamentData.current.scores} allRaceResults={tournamentData.current.allRaceResults} tracks={tournamentData.current.tracks} onPlayAgain={handlePlayAgain} onMenu={handleMenu} />;
      default: return null;
    }
  };

  return (
    <>
      <AnimatedBackground />
      {/* --- 5. RENDER the toggle button after the first interaction --- */}
      {isAudioRequested && <AudioToggle isAudioEnabled={isAudioEnabled} onToggle={handleAudioToggle} />}
      <div className="game-wrapper">
        {renderContent()}
      </div>
    </>
  );
}

export default App;