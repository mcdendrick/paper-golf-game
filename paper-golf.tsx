import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CELL_TYPES = {
  ROUGH: 'rough',
  FAIRWAY: 'fairway',
  SAND: 'sand',
  WATER: 'water',
  TREE: 'tree',
  HOLE: 'hole',
  START: 'start',
  SLOPE: 'slope'
};

const GRID_SIZE = 10;

const PaperGolfGame = () => {
  const [gameState, setGameState] = useState({
    ballPosition: { x: 1, y: 8 }, // Starting position
    strokes: 0,
    path: [],
    lastRoll: null,
    gameOver: false
  });

  const [grid, setGrid] = useState(() => {
    const initialGrid = Array(GRID_SIZE).fill().map(() => 
      Array(GRID_SIZE).fill(CELL_TYPES.ROUGH)
    );
    
    // Set up the course
    // Fairway
    for (let i = 1; i < 9; i++) {
      initialGrid[i][3] = CELL_TYPES.FAIRWAY;
      initialGrid[i][4] = CELL_TYPES.FAIRWAY;
      initialGrid[i][5] = CELL_TYPES.FAIRWAY;
    }
    
    // Sand traps
    initialGrid[3][2] = CELL_TYPES.SAND;
    initialGrid[7][6] = CELL_TYPES.SAND;
    
    // Water
    initialGrid[5][2] = CELL_TYPES.WATER;
    initialGrid[5][3] = CELL_TYPES.WATER;
    
    // Trees
    initialGrid[2][6] = CELL_TYPES.TREE;
    initialGrid[6][2] = CELL_TYPES.TREE;
    
    // Hole
    initialGrid[8][4] = CELL_TYPES.HOLE;
    
    // Starting position
    initialGrid[1][8] = CELL_TYPES.START;
    
    return initialGrid;
  });

  const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const getValidMoves = (position, rollValue) => {
    const { x, y } = position;
    const currentCell = grid[x][y];
    
    // Adjust roll value based on terrain
    let adjustedRoll = rollValue;
    if (currentCell === CELL_TYPES.FAIRWAY) adjustedRoll += 1;
    if (currentCell === CELL_TYPES.SAND) adjustedRoll = Math.max(1, adjustedRoll - 1);
    
    const validMoves = [];
    
    // Check all possible directions (including diagonals)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        const newX = x + dx * adjustedRoll;
        const newY = y + dy * adjustedRoll;
        
        // Check if move is within grid bounds
        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
          const targetCell = grid[newX][newY];
          
          // Check if move is valid based on terrain rules
          if (targetCell !== CELL_TYPES.WATER &&
              (targetCell !== CELL_TYPES.TREE || currentCell === CELL_TYPES.FAIRWAY)) {
            validMoves.push({ x: newX, y: newY });
          }
        }
      }
    }
    
    return validMoves;
  };

  const handleCellClick = (x, y) => {
    if (gameState.gameOver) return;
    
    const roll = rollDice();
    const validMoves = getValidMoves(gameState.ballPosition, roll);
    
    const isValidMove = validMoves.some(move => move.x === x && move.y === y);
    if (!isValidMove) return;
    
    const newPath = [...gameState.path, {
      from: { ...gameState.ballPosition },
      to: { x, y }
    }];
    
    const isHole = grid[x][y] === CELL_TYPES.HOLE;
    
    setGameState(prev => ({
      ...prev,
      ballPosition: { x, y },
      strokes: prev.strokes + 1,
      path: newPath,
      lastRoll: roll,
      gameOver: isHole
    }));
  };

  const getCellStyle = (x, y) => {
    const cellType = grid[x][y];
    const isCurrentBall = gameState.ballPosition.x === x && gameState.ballPosition.y === y;
    
    const baseStyle = "w-8 h-8 border border-gray-400 cursor-pointer flex items-center justify-center";
    
    let backgroundColor = "bg-green-800"; // Rough
    if (cellType === CELL_TYPES.FAIRWAY) backgroundColor = "bg-green-500";
    if (cellType === CELL_TYPES.SAND) backgroundColor = "bg-yellow-200";
    if (cellType === CELL_TYPES.WATER) backgroundColor = "bg-blue-500";
    if (cellType === CELL_TYPES.TREE) backgroundColor = "bg-green-900";
    if (cellType === CELL_TYPES.HOLE) backgroundColor = "bg-black";
    
    return `${baseStyle} ${backgroundColor} ${isCurrentBall ? 'ring-2 ring-white' : ''}`;
  };

  const renderGrid = () => (
    <div className="grid grid-cols-10 gap-0">
      {grid.map((row, x) => (
        row.map((cell, y) => (
          <div
            key={`${x}-${y}`}
            className={getCellStyle(x, y)}
            onClick={() => handleCellClick(x, y)}
          >
            {gameState.ballPosition.x === x && gameState.ballPosition.y === y && (
              <div className="w-4 h-4 rounded-full bg-white" />
            )}
          </div>
        ))
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Paper Golf</h2>
          <p>Strokes: {gameState.strokes} {gameState.strokes > 6 ? '(Over Par)' : ''}</p>
          {gameState.lastRoll && <p>Last Roll: {gameState.lastRoll}</p>}
          {gameState.gameOver && <p className="text-green-500 font-bold">Hole in {gameState.strokes}!</p>}
        </div>
        {renderGrid()}
        <div className="mt-4">
          <h3 className="font-bold mb-2">Legend:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>🟩 Fairway (+1 to roll)</div>
            <div>🟨 Sand (-1 to roll)</div>
            <div>🌊 Water (cannot land)</div>
            <div>🌲 Tree (cross from fairway)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaperGolfGame;