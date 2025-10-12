// --- Game State Enum ---
export const GAME_STATE = {
  MENU: 'menu',
  PLAYER_SETUP: 'player_setup',
  MODE_SELECTION: 'mode_selection',
  TRACK_SELECTION: 'track_selection',
  TOURNAMENT_SETUP: 'tournament_setup',
  TOURNAMENT_TRACK_SELECTION: 'tournament_track_selection',
  TOURNAMENT_STANDINGS: 'tournament_standings',
  TOURNAMENT_FINISHED: 'tournament_finished',
  COUNTDOWN: 'countdown',
  PLAYING: 'playing',
  FINISHED: 'finished',
};

// --- F1 Points System for Top 5 ---
export const POINTS_SYSTEM = [25, 18, 15, 12, 10];

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
  { name: 'A*', color: '#ff0000ff' },
];

// --- FINAL CURATED Track Data with Flags ---
export const TRACKS = [
  { name: 'Red Bull Ring', flag: '🇦🇹', description: 'A short, fast lap with heavy braking zones and flowing corners.', complexity: 0.05, image: '/images/redbullring.png' },
  { name: 'Monza', flag: '🇮🇹', description: 'The Temple of Speed. Long straights and heavy braking define this classic circuit.', complexity: 0.07, image: '/images/monza.png' },
  { name: 'Zandvoort', flag: '🇳🇱', description: 'A tight, twisty, old-school track with punishing banked corners.', complexity: 0.11, image: '/images/zandvoort.png' },
  { name: 'Silverstone', flag: '🇬🇧', description: 'The home of British motorsport, known for its high-speed corners.', complexity: 0.12, image: '/images/silverstone.png' },
  { name: 'Suzuka', flag: '🇯🇵', description: 'A legendary figure-eight circuit that is a true test of driver skill.', complexity: 0.14, image: '/images/suzuka.png' },
  { name: 'São Paulo', flag: '🇧🇷', description: 'A fast, open track with numerous passing opportunities and elevation changes.', complexity: 0.15, image: '/images/saopaulo.png' },
];


// --- Maze Dimensions ---
export const MAZE_WIDTH = 41;  // Must be odd
export const MAZE_HEIGHT = 25; // Must be odd

// --- Other Constants ---
export const CELL_SIZE = 22;
export const START_POS = { x: 1, y: 1 };
export const FINISH_POS = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };