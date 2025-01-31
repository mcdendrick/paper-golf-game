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
      <CardContent className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="w-full sm:w-[300px]">
            <div className="flex items-center gap-2 sm:gap-4 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold whitespace-nowrap">{gameState.course.name}</h2>
              <span className="text-base sm:text-lg text-gray-600 whitespace-nowrap">
                Hole {gameState.course.currentHole} of {gameState.course.totalHoles}
              </span>
            </div>
            <div className="space-y-1 text-sm sm:text-base">
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
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:w-[200px]">
            {/* Top Left: Roll Dice */}
            {!gameState.isPutting ? (
              <button
                onClick={rollDice}
                disabled={gameState.gameOver || gameState.lastRoll !== null}
                className="w-full px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Roll Dice
              </button>
            ) : (
              <div className="w-full h-[36px] sm:h-[40px]" />
            )}

            {/* Top Right: Use Mulligan */}
            {!gameState.isPutting ? (
              <button
                onClick={useMulligan}
                disabled={!canUseMulligan}
                className="w-full px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600 transition-colors text-sm sm:text-base"
              >
                {gameState.strokes === 0 && !gameState.hasUsedFreeTee 
                  ? 'Free Mulligan' 
                  : 'Use Mulligan'}
              </button>
            ) : (
              <div className="w-full h-[36px] sm:h-[40px]" />
            )}

            {/* Bottom Left: Putt/Cancel */}
            {!gameState.lastRoll && !gameState.gameOver ? (
              <button
                onClick={gameState.isPutting ? cancelPutting : startPutting}
                className={`w-full px-3 sm:px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm sm:text-base ${
                  gameState.isPutting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {gameState.isPutting ? 'Cancel Putt' : 'Putt'}
              </button>
            ) : (
              <div className="w-full h-[36px] sm:h-[40px]" />
            )}

            {/* Bottom Right: Reset Game */}
            <button
              onClick={resetGame}
              className="w-full px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
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
          gameState={gameState}
        />
      </CardContent>
    </Card>
  );
}; 