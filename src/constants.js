// --- Timing ---
export const BOT_MOVE_INTERVAL = 400; // Significantly slowed down bots for better gameplay balance
export const PLAYER_MOVE_COOLDOWN = 50; // Player can move faster

// --- Game State Enum ---
export const GAME_STATE = {
  MENU: 'menu',
  PLAYER_SETUP: 'player_setup',
  TRACK_SELECTION: 'track_selection',
  COUNTDOWN: 'countdown',
  PLAYING: 'playing',
  FINISHED: 'finished',
};

// --- Bot Configuration ---
export const BOT_CONFIG = [
  { name: 'BFS', color: '#00ffff' },
  { name: 'DFS', color: '#ff00ff' },
  { name: 'GBFS', color: '#00ff7f' },
  { name: 'A*', color: '#ffa500' },
];

// Per-bot speed range (in milliseconds). Each bot will be assigned a random move interval
// sampled uniformly from [BOT_SPEED_MIN, BOT_SPEED_MAX]. Lower = faster.
export const BOT_SPEED_MIN = 220;
export const BOT_SPEED_MAX = 520;

// --- Track Data ---
export const TRACKS = [
  { name: 'Imola', description: 'A classic, technical track with flowing corners.', complexity: 0.06 },
  { name: 'Baku', description: 'A chaotic street circuit with tight turns and a long straight.', complexity: 0.09 },
  { name: 'Interlagos', description: 'A fast, open track with numerous passing opportunities.', complexity: 0.15 },
];

// --- NEW, LARGER MAZE DIMENSIONS ---
export const MAZE_WIDTH = 41;  // Must be odd
export const MAZE_HEIGHT = 25; // Must be odd

// --- Other Constants ---
export const CELL_SIZE = 22; // Slightly smaller cells to fit the larger maze on screen
export const START_POS = { x: 1, y: 1 };
export const FINISH_POS = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };