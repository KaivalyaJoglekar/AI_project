import { MAZE_WIDTH, MAZE_HEIGHT } from '../constants';

export const generateMaze = (width = MAZE_WIDTH, height = MAZE_HEIGHT, complexity = 0.08) => {
  const maze = Array(height).fill(null).map(() => Array(width).fill(1));
  const stack = [];
  maze[1][1] = 0;
  stack.push({ x: 1, y: 1 });

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = [];
    for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [0, 2]]) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === 1) {
        neighbors.push({ x: nx, y: ny });
      }
    }
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[next.y][next.x] = 0;
      maze[current.y + (next.y - current.y) / 2][current.x + (next.x - current.x) / 2] = 0;
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  const wallsToRemove = Math.floor((width * height) * complexity);
  for (let i = 0; i < wallsToRemove; i++) {
    const rx = Math.floor(Math.random() * (width - 2)) + 1;
    const ry = Math.floor(Math.random() * (height - 2)) + 1;
    if (maze[ry][rx] === 1) {
      if ((maze[ry - 1][rx] === 0 && maze[ry + 1][rx] === 0) ||
          (maze[ry][rx - 1] === 0 && maze[ry][rx + 1] === 0)) {
        maze[ry][rx] = 0;
      }
    }
  }
  return maze;
};