import React from 'react';
import { CELL_TYPES, type Position, type Grid } from '../../types/paper-golf';

interface GameBoardProps {
  grid: Grid;
  ballPosition: Position;
  path: Array<{ from: Position; to: Position }>;
  onCellClick: (x: number, y: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  ballPosition,
  path,
  onCellClick,
}) => {
  const getCellStyle = (x: number, y: number) => {
    const cellType = grid[x][y];
    const isCurrentBall = ballPosition.x === x && ballPosition.y === y;
    
    const baseStyle = "w-8 h-8 border border-gray-400 cursor-pointer flex items-center justify-center relative";
    
    let backgroundColor = "bg-green-800"; // Rough
    if (cellType === CELL_TYPES.FAIRWAY) backgroundColor = "bg-green-500";
    if (cellType === CELL_TYPES.SAND) backgroundColor = "bg-yellow-200";
    if (cellType === CELL_TYPES.WATER) backgroundColor = "bg-blue-500";
    if (cellType === CELL_TYPES.TREE) backgroundColor = "bg-green-900";
    if (cellType === CELL_TYPES.HOLE) backgroundColor = "bg-black";
    if (cellType === CELL_TYPES.START) backgroundColor = "bg-purple-500";
    
    return `${baseStyle} ${backgroundColor} ${isCurrentBall ? 'ring-2 ring-white' : ''}`;
  };

  const renderPath = () => {
    return path.map((segment, index) => {
      const startX = segment.from.y * 32 + 16;
      const startY = segment.from.x * 32 + 16;
      const endX = segment.to.y * 32 + 16;
      const endY = segment.to.x * 32 + 16;
      
      return (
        <line
          key={index}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="white"
          strokeWidth="2"
          strokeDasharray="4"
          className="pointer-events-none"
        />
      );
    });
  };

  return (
    <div className="relative">
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {renderPath()}
      </svg>
      <div className="grid grid-cols-10 gap-0 relative" style={{ zIndex: 0 }}>
        {grid.map((row, x) => (
          row.map((cell, y) => (
            <div
              key={`${x}-${y}`}
              className={getCellStyle(x, y)}
              onClick={() => onCellClick(x, y)}
            >
              {ballPosition.x === x && ballPosition.y === y && (
                <div className="w-4 h-4 rounded-full bg-white z-10" />
              )}
              {cell === CELL_TYPES.HOLE && (
                <div className="w-3 h-3 rounded-full bg-gray-700 absolute" />
              )}
              {cell === CELL_TYPES.TREE && (
                <span className="text-sm">🌲</span>
              )}
            </div>
          ))
        ))}
      </div>
    </div>
  );
}; 