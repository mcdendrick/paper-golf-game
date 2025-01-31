import React from 'react';
import { CELL_TYPES, type Position, type Grid, type GameState } from '../../types/paper-golf';

interface GameBoardProps {
  grid: Grid;
  ballPosition: Position;
  path: Array<{ from: Position; to: Position }>;
  validMoves: Position[];
  puttableSquares: Position[];
  onCellClick: (x: number, y: number) => void;
  gameState: GameState;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  ballPosition,
  path,
  validMoves,
  puttableSquares,
  onCellClick,
  gameState,
}) => {
  type PathDirection = { dx: number; dy: number };
  
  const isDirection = (value: unknown): value is PathDirection => {
    if (!value || typeof value !== 'object' || value === null) return false;
    return 'dx' in value && 'dy' in value;
  };

  const isPartOfPath = (x: number, y: number, pathType: 'dot' | 'line' | 'direction'): boolean | PathDirection | null => {
    if (path.length === 0) return pathType === 'direction' ? null : false;

    // Check if this position is a start or end point
    if (pathType === 'dot') {
      return path.some((segment, index) => {
        const isStart = segment.from.x === x && segment.from.y === y;
        const isEnd = segment.to.x === x && segment.to.y === y;
        // Don't show end dot for current ball position
        if (index === path.length - 1) {
          return isStart;
        }
        return isStart || isEnd;
      });
    }

    // For line segments, find which segment this point belongs to
    const segment = path.find(segment => {
      const { from, to } = segment;
      
      // Calculate the direction vector
      const dx = Math.sign(to.x - from.x);
      const dy = Math.sign(to.y - from.y);
      
      // If we're not in the bounding box of the line, return false
      if (dx > 0 && (x < from.x || x > to.x)) return false;
      if (dx < 0 && (x > from.x || x < to.x)) return false;
      if (dy > 0 && (y < from.y || y > to.y)) return false;
      if (dy < 0 && (y > from.y || y < to.y)) return false;

      // Check if point lies on the line
      if (dx === 0) return x === from.x;
      if (dy === 0) return y === from.y;
      
      // For diagonal lines
      const slope = (to.y - from.y) / (to.x - from.x);
      const expectedY = from.y + slope * (x - from.x);
      return Math.abs(y - expectedY) < 0.1;
    });

    if (!segment) return pathType === 'direction' ? null : false;

    if (pathType === 'direction') {
      const { from, to } = segment;
      // Return the direction of the line for this point
      const dx = Math.sign(to.x - from.x);
      const dy = Math.sign(to.y - from.y);
      return { dx, dy };
    }

    return true;
  };

  const getPathStyle = (x: number, y: number) => {
    const direction = isPartOfPath(x, y, 'direction');
    if (!direction || !isDirection(direction)) return '';

    const { dx, dy } = direction;
    let borderStyle = 'border-2 '; // Make borders thicker

    // Determine which borders to show based on direction
    if (dy !== 0) {
      borderStyle += dy > 0 ? 'border-b-white border-b-[3px] ' : 'border-t-white border-t-[3px] ';
    }
    if (dx !== 0) {
      borderStyle += dx > 0 ? 'border-r-white border-r-[3px] ' : 'border-l-white border-l-[3px] ';
    }

    return borderStyle;
  };

  const getCellStyle = (x: number, y: number) => {
    const cellType = grid[y][x];
    const isCurrentBall = ballPosition.x === x && ballPosition.y === y;
    const isValidMove = validMoves.some(move => move.x === x && move.y === y);
    const isPuttable = puttableSquares.some(square => square.x === x && square.y === y);
    const pathStyle = getPathStyle(x, y);
    
    const baseStyle = "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 border border-gray-700/20 cursor-pointer flex items-center justify-center relative";
    
    let backgroundColor = "bg-green-800"; // Rough
    if (cellType === CELL_TYPES.FAIRWAY) backgroundColor = "bg-green-500";
    if (cellType === CELL_TYPES.SAND) backgroundColor = "bg-yellow-200";
    if (cellType === CELL_TYPES.WATER) backgroundColor = "bg-blue-500";
    if (cellType === CELL_TYPES.TREE) backgroundColor = "bg-green-900";
    if (cellType === CELL_TYPES.HOLE) backgroundColor = "bg-black";
    if (cellType === CELL_TYPES.START) backgroundColor = "bg-purple-500";
    
    const highlightStyle = isValidMove ? 'ring-2 ring-yellow-300 ring-opacity-100 animate-pulse' : '';
    const puttableStyle = isPuttable ? 'ring-2 ring-green-300 ring-opacity-100' : '';
    const ballStyle = isCurrentBall ? 'ring-2 ring-white' : '';
    
    return `${baseStyle} ${backgroundColor} ${pathStyle} ${highlightStyle} ${puttableStyle} ${ballStyle}`;
  };

  return (
    <div className="relative p-2 overflow-x-auto">
      <div className="grid grid-rows-15 gap-0 relative w-fit mx-auto">
        {grid.map((row, y) => (
          <div key={y} className="flex flex-row">
            {row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={getCellStyle(x, y)}
                onClick={() => onCellClick(x, y)}
              >
                {ballPosition.x === x && ballPosition.y === y && (
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-white z-10" />
                )}
                {cell === CELL_TYPES.HOLE && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-700 absolute" />
                )}
                {cell === CELL_TYPES.TREE && (
                  <span className="text-[8px] sm:text-[9px] md:text-[10px]">🌲</span>
                )}
                {isPartOfPath(x, y, 'dot') && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                  </div>
                )}
                {validMoves.some(move => move.x === x && move.y === y) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-yellow-300 animate-ping" />
                  </div>
                )}
                {puttableSquares.some(square => square.x === x && square.y === y) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {gameState.gameOver && (
        <div className="mt-4 mb-2 p-3 sm:p-4 bg-green-100 text-green-800 rounded-lg text-sm sm:text-base border-2 border-green-200 shadow-lg">
          <p className="font-bold text-center">🎉 Hole in {gameState.strokes}! 🎉</p>
          <p className="text-center">
            {gameState.strokes <= gameState.course.par 
              ? 'Great job! You made par or better!' 
              : `Try again to beat par (${gameState.course.par} strokes)!`}
          </p>
        </div>
      )}
      <div className="mt-4 text-sm">
        <h3 className="font-bold mb-2">Legend:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
          <div>🟩 Fairway (+1 to roll)</div>
          <div>🟨 Sand (-1 to roll)</div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500"></div>
            <span>Water (cannot land)</span>
          </div>
          <div>🌲 Tree (cross from fairway)</div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-500"></div>
            <span>Starting Tee</span>
          </div>
        </div>
        <div className="mt-2 text-xs sm:text-sm text-gray-600">
          <p>• Choose to putt (1 square) or roll dice for a longer shot</p>
          <p>• You get 6 mulligans per round</p>
          <p>• First tee shot gets a free mulligan</p>
          <p>• Ball will go in hole if roll is exact or one over distance needed</p>
        </div>
      </div>
    </div>
  );
}; 