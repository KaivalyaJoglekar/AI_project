import React from 'react';
import { START_POS, FINISH_POS, CELL_SIZE } from '../constants';

const Board = ({ maze, playerPos, bots }) => {
  const getCellClass = (x, y, cellType) => {
    if (x === START_POS.x && y === START_POS.y) return 'cell-start';
    if (x === FINISH_POS.x && y === FINISH_POS.y) return 'cell-finish';
    return cellType === 1 ? 'cell-wall' : 'cell-path';
  };

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${maze[0].length}, ${CELL_SIZE}px)`,
      }}
    >
      {maze.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`cell ${getCellClass(x, y, cell)}`}
            style={{ width: `${CELL_SIZE}px`, height: `${CELL_SIZE}px` }}
          >
            {playerPos.x === x && playerPos.y === y && (
              <div
                className="entity pos-player"
                style={{ backgroundColor: 'gold' }}
              />
            )}
            
            {bots.map(bot =>
              bot.pos.x === x && bot.pos.y === y && (
                <div
                  key={bot.name}
                  className={`entity pos-${bot.name}`}
                  style={{ backgroundColor: bot.color }}
                />
              )
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;