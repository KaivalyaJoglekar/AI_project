export const dfs = (maze, start, end) => {
  const stack = [[start]];
  const visited = new Set([`${start.x},${start.y}`]);
  const width = maze[0].length;
  const height = maze.length;

  while (stack.length > 0) {
    const path = stack.pop();
    const { x, y } = path[path.length - 1];

    if (x === end.x && y === end.y) return path;

    // Explore neighbors: Up, Left, Down, Right (to create different-looking paths than BFS)
    for (const [dx, dy] of [[0, -1], [-1, 0], [0, 1], [1, 0]]) {
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
        stack.push(newPath);
      }
    }
  }
  return []; // No path found
};