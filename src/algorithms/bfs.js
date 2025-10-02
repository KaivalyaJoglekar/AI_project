export const bfs = (maze, start, end) => {
  const queue = [[start]];
  const visited = new Set([`${start.x},${start.y}`]);
  const width = maze[0].length;
  const height = maze.length;

  while (queue.length > 0) {
    const path = queue.shift();
    const { x, y } = path[path.length - 1];

    if (x === end.x && y === end.y) return path;

    // Explore neighbors: Right, Down, Left, Up
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
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
        queue.push(newPath);
      }
    }
  }
  return []; // No path found
};