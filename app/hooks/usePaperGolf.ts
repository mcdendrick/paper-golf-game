import { useState, useCallback } from 'react';
import { CELL_TYPES, type Position, type GameState, type Grid, type PathSegment } from '../types/paper-golf';

const GRID_WIDTH = 20;  // Horizontal size
const GRID_HEIGHT = 15; // Vertical size
const MAX_MULLIGANS = 6;

export const usePaperGolf = () => {
  const [gameState, setGameState] = useState<GameState>({
    ballPosition: { x: 10, y: 13 }, // Adjusted to match starting tee position
    strokes: 0,
    path: [],
    lastRoll: null,
    gameOver: false,
    mulligansUsed: 0,
    hasUsedFreeTee: false,
    puttableSquares: [],
    isPutting: false,
    course: {
      name: "Pine Valley",
      currentHole: 1,
      totalHoles: 18,
      par: 6
    }
  });

  const [validMoves, setValidMoves] = useState<Position[]>([]);

  const [grid] = useState<Grid>(() => {
    const initialGrid = Array(GRID_HEIGHT).fill(null).map(() => 
      Array(GRID_WIDTH).fill(CELL_TYPES.ROUGH)
    );
    
    // Main fairway path
    for (let y = 1; y < 14; y++) {
      for (let x = 8; x < 12; x++) {
        initialGrid[y][x] = CELL_TYPES.FAIRWAY;
      }
    }

    // Trees on left side
    for (let y = 6; y < 10; y++) {
      initialGrid[y][6] = CELL_TYPES.TREE;
      initialGrid[y][7] = CELL_TYPES.TREE;
    }
    for (let y = 10; y < 12; y++) {
      initialGrid[y][7] = CELL_TYPES.TREE;
    }

    // Trees on right side
    for (let y = 2; y < 5; y++) {
      initialGrid[y][12] = CELL_TYPES.TREE;
      initialGrid[y][13] = CELL_TYPES.TREE;
    }
    for (let y = 6; y < 9; y++) {
      initialGrid[y][12] = CELL_TYPES.TREE;
    }

    // Water hazards
    initialGrid[5][9] = CELL_TYPES.WATER;
    initialGrid[5][10] = CELL_TYPES.WATER;
    initialGrid[6][9] = CELL_TYPES.WATER;
    initialGrid[6][10] = CELL_TYPES.WATER;

    // Sand traps
    initialGrid[3][11] = CELL_TYPES.SAND;
    initialGrid[4][11] = CELL_TYPES.SAND;
    
    initialGrid[9][8] = CELL_TYPES.SAND;
    initialGrid[10][8] = CELL_TYPES.SAND;
    initialGrid[11][8] = CELL_TYPES.SAND;

    // Hole and starting position
    initialGrid[1][10] = CELL_TYPES.HOLE;   // Hole at top
    initialGrid[13][10] = CELL_TYPES.START; // Start at bottom
    
    return initialGrid;
  });

  const getPuttableSquares = useCallback((position: Position): Position[] => {
    const puttable: Position[] = [];
    const { x, y } = position;
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        const newX = x + dx;
        const newY = y + dy;
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          const targetCell = grid[newY][newX];
          if (targetCell !== CELL_TYPES.WATER) {
            puttable.push({ x: newX, y: newY });
          }
        }
      }
    }
    
    return puttable;
  }, [grid]);

  const startPutting = useCallback(() => {
    if (gameState.gameOver || gameState.lastRoll) return;
    
    const puttableSquares = getPuttableSquares(gameState.ballPosition);
    setGameState(prev => ({
      ...prev,
      puttableSquares,
      isPutting: true
    }));
    setValidMoves([]);
  }, [gameState.gameOver, gameState.lastRoll, gameState.ballPosition, getPuttableSquares]);

  const cancelPutting = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      puttableSquares: [],
      isPutting: false
    }));
  }, []);

  const rollDice = useCallback(() => {
    if (gameState.gameOver || gameState.isPutting) return;
    
    const roll = Math.floor(Math.random() * 6) + 1;
    const newValidMoves = getValidMoves(gameState.ballPosition, roll);
    
    setGameState(prev => ({
      ...prev,
      lastRoll: roll,
      puttableSquares: []
    }));
    setValidMoves(newValidMoves);
  }, [gameState.gameOver, gameState.isPutting, gameState.ballPosition]);

  const useMulligan = useCallback(() => {
    if (gameState.gameOver) return;
    if (!gameState.lastRoll) return;
    
    // Check if we can use a mulligan
    const isFirstTee = gameState.strokes === 0 && !gameState.hasUsedFreeTee;
    if (!isFirstTee && gameState.mulligansUsed >= MAX_MULLIGANS) return;
    
    setGameState(prev => ({
      ...prev,
      mulligansUsed: isFirstTee ? prev.mulligansUsed : prev.mulligansUsed + 1,
      hasUsedFreeTee: isFirstTee ? true : prev.hasUsedFreeTee,
      lastRoll: null
    }));
    setValidMoves([]);
  }, [gameState.gameOver, gameState.lastRoll, gameState.strokes, gameState.mulligansUsed, gameState.hasUsedFreeTee]);

  const getValidMoves = useCallback((position: Position, rollValue: number): Position[] => {
    const { x, y } = position;
    const currentCell = grid[y][x];
    
    let adjustedRoll = rollValue;
    if (currentCell === CELL_TYPES.FAIRWAY) adjustedRoll += 1;
    if (currentCell === CELL_TYPES.SAND) adjustedRoll = Math.max(1, adjustedRoll - 1);
    
    const validMoves: Position[] = [];
    
    // First, find the hole position if it's within reach
    let holePosition: Position | null = null;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        // Check both exact distance and one over
        for (const dist of [adjustedRoll, adjustedRoll - 1]) {
          if (dist <= 0) continue;
          
          const newX = x + dx * dist;
          const newY = y + dy * dist;
          
          if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            const targetCell = grid[newY][newX];
            if (targetCell === CELL_TYPES.HOLE) {
              holePosition = { x: newX, y: newY };
            }
          }
        }
      }
    }

    // If we found a hole within reach, that's our only valid move
    if (holePosition) {
      return [holePosition];
    }
    
    // Otherwise, calculate normal valid moves
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        const newX = x + dx * adjustedRoll;
        const newY = y + dy * adjustedRoll;
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          const targetCell = grid[newY][newX];
          
          // Never allow landing on water or trees (even from fairway)
          if (targetCell !== CELL_TYPES.WATER && targetCell !== CELL_TYPES.TREE) {
            validMoves.push({ x: newX, y: newY });
          }
        }
      }
    }
    
    return validMoves;
  }, [grid]);

  const handleMove = useCallback((x: number, y: number) => {
    if (gameState.gameOver) return;
    
    const isPuttingMove = gameState.isPutting && gameState.puttableSquares.some(
      square => square.x === x && square.y === y
    );
    const isNormalMove = gameState.lastRoll && validMoves.some(
      move => move.x === x && move.y === y
    );
    
    if (!isPuttingMove && !isNormalMove) return;
    
    const newPath: PathSegment[] = [...gameState.path, {
      from: { 
        x: gameState.ballPosition.x,
        y: gameState.ballPosition.y
      },
      to: { x, y }
    }];
    
    const isHole = grid[y][x] === CELL_TYPES.HOLE;
    
    setGameState(prev => ({
      ...prev,
      ballPosition: { x, y },
      strokes: prev.strokes + 1,
      path: newPath,
      lastRoll: null,
      gameOver: isHole,
      puttableSquares: [],
      isPutting: false
    }));
    setValidMoves([]);
  }, [gameState, grid, validMoves]);

  const resetGame = useCallback(() => {
    setGameState({
      ballPosition: { x: 10, y: 13 },
      strokes: 0,
      path: [],
      lastRoll: null,
      gameOver: false,
      mulligansUsed: 0,
      hasUsedFreeTee: false,
      puttableSquares: [],
      isPutting: false,
      course: {
        name: "Pine Valley",
        currentHole: 1,
        totalHoles: 18,
        par: 6
      }
    });
    setValidMoves([]);
  }, []);

  return {
    gameState,
    grid,
    handleMove,
    rollDice,
    validMoves,
    resetGame,
    useMulligan,
    startPutting,
    cancelPutting
  };
}; 