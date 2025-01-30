import { useState, useCallback } from 'react';
import { CELL_TYPES, type Position, type GameState, type Grid, type PathSegment } from '../types/paper-golf';

const GRID_SIZE = 10;

export const usePaperGolf = () => {
  const [gameState, setGameState] = useState<GameState>({
    ballPosition: { x: 1, y: 8 },
    strokes: 0,
    path: [],
    lastRoll: null,
    gameOver: false
  });

  const [grid] = useState<Grid>(() => {
    const initialGrid = Array(GRID_SIZE).fill(null).map(() => 
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

  const rollDice = useCallback(() => {
    return Math.floor(Math.random() * 6) + 1;
  }, []);

  const getValidMoves = useCallback((position: Position, rollValue: number): Position[] => {
    const { x, y } = position;
    const currentCell = grid[x][y];
    
    let adjustedRoll = rollValue;
    if (currentCell === CELL_TYPES.FAIRWAY) adjustedRoll += 1;
    if (currentCell === CELL_TYPES.SAND) adjustedRoll = Math.max(1, adjustedRoll - 1);
    
    const validMoves: Position[] = [];
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        const newX = x + dx * adjustedRoll;
        const newY = y + dy * adjustedRoll;
        
        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
          const targetCell = grid[newX][newY];
          
          if (targetCell !== CELL_TYPES.WATER &&
              (targetCell !== CELL_TYPES.TREE || currentCell === CELL_TYPES.FAIRWAY)) {
            validMoves.push({ x: newX, y: newY });
          }
        }
      }
    }
    
    return validMoves;
  }, [grid]);

  const handleMove = useCallback((x: number, y: number) => {
    if (gameState.gameOver) return;
    
    const roll = rollDice();
    const validMoves = getValidMoves(gameState.ballPosition, roll);
    
    const isValidMove = validMoves.some(move => move.x === x && move.y === y);
    if (!isValidMove) return;
    
    const newPath: PathSegment[] = [...gameState.path, {
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
  }, [gameState, grid, getValidMoves, rollDice]);

  return {
    gameState,
    grid,
    handleMove,
    getValidMoves
  };
}; 