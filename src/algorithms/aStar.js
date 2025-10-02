// Heuristic function (Manhattan distance)
const manhattanDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Simple Priority Queue for A*
class PriorityQueue {
  constructor() { this.elements = []; }
  enqueue(priority, item) { this.elements.push({ priority, item }); this.elements.sort((a, b) => a.priority - b.priority); }
  dequeue() { return this.elements.shift().item; }
  isEmpty() { return this.elements.length === 0; }
}

export const aStar = (maze, start, end) => {
  const pq = new PriorityQueue();
  // Priority is f(n) = g(n) + h(n), where g(n) is cost so far and h(n) is heuristic
  const gCost = 0;
  const hCost = manhattanDistance(start, end);
  pq.enqueue(gCost + hCost, [start]);
  
  const visited = new Set([`${start.x},${start.y}`]);
  const width = maze[0].length;
  const height = maze.length;

  while (!pq.isEmpty()) {
    const path = pq.dequeue();
    const { x, y } = path[path.length - 1];

    if (x === end.x && y === end.y) return path;

    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nextX = x + dx;
      const nextY = y + dy;
      const key = `${nextX},${nextY}`;
      
      if (
        nextX >= 0 && nextX < width &&
        nextY >= 0 && nextY < height &&
        (maze[nextY][nextX] === 0 || (nextX === end.x && nextY === end.y)) &&
        !visited.has(key)
      ) {
        visited.add(key);
        const newPath = [...path, { x: nextX, y: nextY }];
        const newGCost = newPath.length - 1; // Cost is the length of the path
        const newHCost = manhattanDistance({ x: nextX, y: nextY }, end);
        pq.enqueue(newGCost + newHCost, newPath);
      }
    }
  }
  return []; // No path found
};