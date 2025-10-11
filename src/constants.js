// --- Game State Enum ---
export const GAME_STATE = {
  MENU: 'menu',
  PLAYER_SETUP: 'player_setup',
  TRACK_SELECTION: 'track_selection',
  COUNTDOWN: 'countdown',
  PLAYING: 'playing',
  FINISHED: 'finished',
};

// --- Timing ---
export const PLAYER_MOVE_COOLDOWN = 50; // Player can move faster

// --- Bot Speed ---
export const BOT_SPEED_MIN = 300; // The fastest a bot can move (milliseconds per step)
export const BOT_SPEED_MAX = 500; // The slowest a bot can move

// --- Bot Configuration ---
export const BOT_CONFIG = [
  { name: 'BFS', color: '#00ffff' },
  { name: 'DFS', color: '#ff00ff' },
  { name: 'GBFS', color: '#00ff7f' },
  { name: 'A*', color: '#ffa500' },
];

// --- Track Data ---
export const TRACKS = [
  { name: 'Imola', description: 'A classic, technical track with flowing corners.', complexity: 0.06 },
  { name: 'Baku', description: 'A chaotic street circuit with tight turns and a long straight.', complexity: 0.09 },
  { name: 'Interlagos', description: 'A fast, open track with numerous passing opportunities.', complexity: 0.15 },
];

// --- Maze Dimensions ---
export const MAZE_WIDTH = 41;  // Must be odd
export const MAZE_HEIGHT = 25; // Must be odd

// --- Other Constants ---
export const CELL_SIZE = 22;
export const START_POS = { x: 1, y: 1 };
export const FINISH_POS = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };