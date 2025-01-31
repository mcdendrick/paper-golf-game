import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { GameBoard } from './GameBoard';
import { usePaperGolf } from '../../hooks/usePaperGolf';

export const PaperGolfGame: React.FC = () => {
  const { 
    gameState, 
    grid, 
    handleMove, 
    rollDice, 
    validMoves, 
    resetGame, 
    useMulligan,
    startPutting,
    cancelPutting
  } = usePaperGolf();

  const canUseMulligan = gameState.lastRoll !== null && 
    (gameState.strokes === 0 && !gameState.hasUsedFreeTee || gameState.mulligansUsed < 6);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-start">
          <div className="w-[300px]">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-2xl font-bold whitespace-nowrap">{gameState.course.name}</h2>
              <span className="text-lg text-gray-600 whitespace-nowrap">
                Hole {gameState.course.currentHole} of {gameState.course.totalHoles}
              </span>
            </div>
            <div className="space-y-1">
              <p>Strokes: {gameState.strokes} {gameState.strokes > gameState.course.par ? '(Over Par)' : ''}</p>
              <p className="text-gray-600">Par: {gameState.course.par}</p>
              <p>Mulligans: {6 - gameState.mulligansUsed} remaining</p>
              {gameState.lastRoll && (
                <p>Roll: {gameState.lastRoll} - Select a highlighted square to move</p>
              )}
              {gameState.isPutting && (
                <p className="text-sm text-green-600">Select an adjacent square to putt to</p>
              )}
            </div>
          </div>
          <div className="space-y-2 w-[200px]">
            {!gameState.isPutting && (
              <button
                onClick={rollDice}
                disabled={gameState.gameOver || gameState.lastRoll !== null}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Roll Dice
              </button>
            )}
            {!gameState.lastRoll && !gameState.gameOver && (
              gameState.isPutting ? (
                <button
                  onClick={cancelPutting}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cancel Putt
                </button>
              ) : (
                <button
                  onClick={startPutting}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Putt
                </button>
              )
            )}
            {!gameState.isPutting && (
              <button
                onClick={useMulligan}
                disabled={!canUseMulligan}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600 transition-colors"
              >
                {gameState.strokes === 0 && !gameState.hasUsedFreeTee 
                  ? 'Free Mulligan' 
                  : 'Use Mulligan'}
              </button>
            )}
            <button
              onClick={resetGame}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Game
            </button>
          </div>
        </div>
        
        <GameBoard
          grid={grid}
          ballPosition={gameState.ballPosition}
          path={gameState.path}
          validMoves={validMoves}
          puttableSquares={gameState.puttableSquares}
          onCellClick={handleMove}
        />
        
        {gameState.gameOver && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            <p className="font-bold">Hole in {gameState.strokes}!</p>
            <p>
              {gameState.strokes <= gameState.course.par 
                ? 'Great job! You made par or better!' 
                : `Try again to beat par (${gameState.course.par} strokes)!`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 