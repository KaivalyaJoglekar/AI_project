// Heuristic function (Manhattan distance)
const manhattanDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Simple Priority Queue for GBFS
class PriorityQueue {
  constructor() { this.elements = []; }
  enqueue(priority, item) { this.elements.push({ priority, item }); this.elements.sort((a, b) => a.priority - b.priority); }
  dequeue() { return this.elements.shift().item; }
  isEmpty() { return this.elements.length === 0; }
}

export const gbfs = (maze, start, end) => {
  const pq = new PriorityQueue();
  const priority = manhattanDistance(start, end);
  pq.enqueue(priority, [start]);

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
        const newPriority = manhattanDistance({ x: nextX, y: nextY }, end);
        pq.enqueue(newPriority, newPath);
      }
    }
  }
  return []; // No path found
};