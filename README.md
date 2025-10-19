

F1 Maze Race 🏎️🏁



Welcome to F1 Maze Race, an immersive racing game where you navigate through dynamically generated mazes against four distinct AI opponents, each powered by a classic pathfinding algorithm. Built with React and Vite, this project combines the thrill of Formula 1 with the challenge of a complex maze.

This project is a showcase of front-end development skills, state management in React, and the practical application of fundamental AI algorithms.

(Recommended: Add a high-quality GIF of the gameplay here!)

✨ Key Features

Dynamic Maze Generation: Every race is unique! A new maze is generated at the start of each race using a Recursive Backtracking algorithm, with adjustable complexity for different tracks.

Four Unique AI Opponents: Race against a field of four AI drivers, each using a different pathfinding algorithm to find its way to the finish:

BFS (Breadth-First Search): Methodical and guaranteed to find the shortest path.

DFS (Depth-First Search): Explores aggressively, creating unpredictable and varied routes.

GBFS (Greedy Best-First Search): A heuristic-based approach that always tries to move closer to the finish.

A* (A-Star Search): The champion's choice—a smart heuristic algorithm that balances path length and distance to the goal.

Two Exciting Game Modes:

Single Race: Select from one of six iconic F1 circuits and go for a quick win.

Tournament Mode: Compete in a 3 or 5-race championship, earning points based on the official F1 points system.

Accurate Live Leaderboard: A real-time leaderboard tracks every racer's position during the race. Progress and time gaps are calculated accurately using the Manhattan distance to the finish line, providing a fair and true representation of the race standings.

Modern & Polished UI: A sleek, F1-inspired user interface featuring:

An animated "lights out" race countdown.

A dynamic podium celebration with confetti for the winner.

Smooth animations and a visually stunning glassmorphism design.

🛠️ Technologies Used

Core: React, Vite

State Management: React Hooks (useState, useEffect, useRef, useCallback)

Styling: Modern CSS with Flexbox, Grid, and Keyframe Animations

Linting: ESLint for code quality and consistency

Dependencies: react-confetti for the winning celebration.

🚀 Getting Started

To clone and run this project locally, follow these steps.

Prerequisites

Make sure you have the following installed on your machine:

Node.js (v18.x or newer recommended)

npm or yarn

Installation & Setup

Clone the repository:

code
Sh
download
content_copy
expand_less
git clone https://github.com/KaivalyaJoglekar/AI_project.git

Navigate to the project directory:

code
Sh
download
content_copy
expand_less
cd AI_project

Install dependencies:

code
Sh
download
content_copy
expand_less
npm install
Available Scripts

To run the app in development mode:

code
Sh
download
content_copy
expand_less
npm run dev

Open http://localhost:3000 to view it in your browser. The page will hot-reload if you make edits.

To build the app for production:

code
Sh
download
content_copy
expand_less
npm run build

This builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.

To preview the production build locally:

code
Sh
download
content_copy
expand_less
npm run preview
📂 Project Structure

The project follows a standard React application structure, organized for clarity and scalability.

code
Code
download
content_copy
expand_less
/
├── public/              # Static assets and index.html template
├── src/
│   ├── algorithms/      # AI pathfinding algorithms (aStar, bfs, dfs, gbfs)
│   ├── components/      # Reusable React components
│   ├── maze/            # Maze generation logic
│   ├── App.css          # Main application styles
│   ├── App.jsx          # Core application logic and state management
│   ├── constants.js     # Game constants (game states, track data, etc.)
│   └── main.jsx         # Entry point of the React application
├── .eslintrc.cjs        # ESLint configuration
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
🧠 How It Works
Game State Management

The core logic resides in src/App.jsx, which uses a gameState variable to control the application flow—from the main menu to the race finish. React hooks manage all dynamic data, such as racer positions, maze structure, and leaderboard rankings.

AI and Pathfinding

Upon starting a race, a new maze is generated. Each of the four bots is assigned an algorithm from the src/algorithms/ directory. The algorithm computes a path (an array of coordinates) from the start to the finish. During the race, each bot follows its pre-computed path at a randomized speed, simulating a race.

Live Leaderboard Accuracy

To ensure the leaderboard is fair and accurate, a racer's "progress" is not based on the number of steps taken (which would favor inefficient algorithms with longer paths). Instead, it is calculated based on the Manhattan distance from their current position to the finish line. This provides a universal metric that truly reflects who is closest to winning.

💡 Future Improvements

This project has a solid foundation with many opportunities for expansion:

Multiplayer Mode: Implement a real-time multiplayer mode using WebSockets.

More Tracks & Obstacles: Add new tracks with unique obstacles or maze features.

AI Difficulty Levels: Adjust bot speeds or algorithm efficiency to create different difficulty settings.

Player Customization: Allow players to choose different car colors or avatars.

Sound Effects: Add engine sounds, menu music, and race sound effects for a more immersive experience.

