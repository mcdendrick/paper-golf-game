import React from 'react';
import { CELL_TYPES, type Position, type Grid } from '../../types/paper-golf';

interface GameBoardProps {
  grid: Grid;
  ballPosition: Position;
  path: Array<{ from: Position; to: Position }>;
  validMoves: Position[];
  puttableSquares: Position[];
  onCellClick: (x: number, y: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  ballPosition,
  path,
  validMoves,
  puttableSquares,
  onCellClick,
}) => {
  const CELL_SIZE = 28; // Slightly larger cells

  const getCellStyle = (x: number, y: number) => {
    const cellType = grid[y][x]; // Note the y,x order for grid access
    const isCurrentBall = ballPosition.x === x && ballPosition.y === y;
    const isValidMove = validMoves.some(move => move.x === x && move.y === y);
    const isPuttable = puttableSquares.some(square => square.x === x && square.y === y);
    
    const baseStyle = "w-7 h-7 border border-gray-300 cursor-pointer flex items-center justify-center relative";
    
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
    
    return `${baseStyle} ${backgroundColor} ${highlightStyle} ${puttableStyle} ${ballStyle}`;
  };

  const renderPath = () => {
    return path.map((segment, index) => {
      const startX = segment.from.x * CELL_SIZE + CELL_SIZE/2;
      const startY = segment.from.y * CELL_SIZE + CELL_SIZE/2;
      const endX = segment.to.x * CELL_SIZE + CELL_SIZE/2;
      const endY = segment.to.y * CELL_SIZE + CELL_SIZE/2;
      
      return (
        <g key={index}>
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="white"
            strokeWidth="2"
            strokeDasharray="4"
            className="pointer-events-none"
          />
          <circle
            cx={startX}
            cy={startY}
            r="2"
            fill="white"
            className="pointer-events-none"
          />
          <circle
            cx={endX}
            cy={endY}
            r="2"
            fill="white"
            className="pointer-events-none"
          />
        </g>
      );
    });
  };

  return (
    <div className="relative p-2">
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        viewBox={`0 0 ${CELL_SIZE * 20} ${CELL_SIZE * 15}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {renderPath()}
      </svg>
      <div className="grid grid-rows-15 gap-0 relative w-fit" style={{ zIndex: 0 }}>
        {grid.map((row, y) => (
          <div key={y} className="flex flex-row">
            {row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={getCellStyle(x, y)}
                onClick={() => onCellClick(x, y)}
              >
                {ballPosition.x === x && ballPosition.y === y && (
                  <div className="w-3 h-3 rounded-full bg-white z-10" />
                )}
                {cell === CELL_TYPES.HOLE && (
                  <div className="w-2 h-2 rounded-full bg-gray-700 absolute" />
                )}
                {cell === CELL_TYPES.TREE && (
                  <span className="text-[10px]">🌲</span>
                )}
                {validMoves.some(move => move.x === x && move.y === y) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping" />
                  </div>
                )}
                {puttableSquares.some(square => square.x === x && square.y === y) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 