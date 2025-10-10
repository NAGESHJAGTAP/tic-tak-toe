'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Loader2 } from 'lucide-react';

interface GameBoardProps {
  gameId: string;
  playerId: string;
}

export default function GameBoard({ gameId, playerId }: GameBoardProps) {
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [makingMove, setMakingMove] = useState(false);

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      const data = await response.json();
      setGame(data);
    } catch (error) {
      console.error('Failed to fetch game:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
    const interval = setInterval(fetchGame, 2000);
    return () => clearInterval(interval);
  }, [gameId]);

  const makeMove = async (position: number) => {
    if (makingMove || !game || game.status !== 'active' || game.board[position]) {
      return;
    }

    const isPlayer1 = game.player1._id === playerId;
    const playerSymbol = isPlayer1 ? 'X' : 'O';

    if (game.currentTurn !== playerSymbol) {
      return;
    }

    setMakingMove(true);
    try {
      const response = await fetch(`/api/games/${gameId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, position }),
      });
      const updatedGame = await response.json();
      setGame(updatedGame);
    } catch (error) {
      console.error('Failed to make move:', error);
    } finally {
      setMakingMove(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-game-x" />
      </div>
    );
  }

  if (!game) {
    return <div className="text-center text-red-500">Game not found</div>;
  }

  const isPlayer1 = game.player1._id === playerId;
  const isPlayer2 = game.player2?._id === playerId;
  const playerSymbol = isPlayer1 ? 'X' : 'O';
  const isMyTurn = game.status === 'active' && game.currentTurn === playerSymbol;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-game-x animate-pulse"></div>
                <span className="text-game-x font-bold text-lg">{game.player1.username}</span>
              </div>
              <div className="text-2xl font-black text-white ml-5">X</div>
            </div>

            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-game-o font-bold text-lg">
                  {game.player2?.username || 'Waiting...'}
                </span>
                <div className="w-3 h-3 rounded-full bg-game-o animate-pulse"></div>
              </div>
              <div className="text-2xl font-black text-white mr-5">O</div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="space-y-4">
              {isMyTurn && (
                <div className="mb-4 p-3 bg-game-status/20 border border-game-status/50 rounded-lg text-center">
                  <span className="text-game-status font-semibold">Your turn!</span>
                </div>
              )}

              {game.status === 'finished' && (
                <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg text-center animate-win-celebration">
                  {game.winner ? (
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-lg">
                        {game.winner.username} wins!
                      </span>
                    </div>
                  ) : (
                    <span className="text-orange-400 font-bold text-lg">It's a draw!</span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 aspect-square">
                {game.board.map((cell: string | null, index: number) => (
                  <button
                    key={index}
                    onClick={() => makeMove(index)}
                    disabled={
                      !isMyTurn || game.status !== 'active' || !!cell || makingMove
                    }
                    className={`
                      relative aspect-square rounded-xl border-2 transition-all duration-200
                      flex items-center justify-center text-5xl font-black
                      ${cell ? 'animate-move-in' : ''}
                      ${
                        cell === 'X'
                          ? 'border-game-x bg-game-x/10 text-white'
                          : cell === 'O'
                          ? 'border-game-o bg-game-o/10 text-white'
                          : 'border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-game-status'
                      }
                      ${
                        isMyTurn && !cell && game.status === 'active'
                          ? 'cursor-pointer hover:scale-105 hover:shadow-lg'
                          : 'cursor-not-allowed opacity-75'
                      }
                    `}
                  >
                    {cell || ''}
                  </button>
                ))}
              </div>

              {game.status === 'open' && (
                <div className="mt-6 p-4 bg-orange-500/20 border border-orange-500/50 rounded-lg text-center">
                  <p className="text-orange-400">Waiting for opponent to join...</p>
                  <p className="text-sm text-slate-400 mt-1">Share this game ID: {gameId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
