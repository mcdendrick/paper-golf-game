import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { GameBoard } from './GameBoard';
import { usePaperGolf } from '../../hooks/usePaperGolf';

export const PaperGolfGame: React.FC = () => {
  const { gameState, grid, handleMove } = usePaperGolf();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Paper Golf</h2>
          <p>Strokes: {gameState.strokes} {gameState.strokes > 6 ? '(Over Par)' : ''}</p>
          {gameState.lastRoll && <p>Last Roll: {gameState.lastRoll}</p>}
          {gameState.gameOver && <p className="text-green-500 font-bold">Hole in {gameState.strokes}!</p>}
        </div>
        
        <GameBoard
          grid={grid}
          ballPosition={gameState.ballPosition}
          path={gameState.path}
          onCellClick={handleMove}
        />
        
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