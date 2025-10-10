'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trophy, PlayCircle, PauseCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GameReplayPage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const [game, setGame] = useState<any>(null);
  const [moves, setMoves] = useState<any[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));

  useEffect(() => {
    fetchGameData();
  }, [gameId]);

  useEffect(() => {
    if (isPlaying && currentMove < moves.length) {
      const timer = setTimeout(() => {
        setCurrentMove((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentMove >= moves.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentMove, moves.length]);

  useEffect(() => {
    const newBoard = Array(9).fill(null);
    for (let i = 0; i < currentMove; i++) {
      const move = moves[i];
      newBoard[move.position] = move.symbol;
    }
    setBoard(newBoard);
  }, [currentMove, moves]);

  const fetchGameData = async () => {
    try {
      const [gameRes, movesRes] = await Promise.all([
        fetch(`/api/games/${gameId}`),
        fetch(`/api/games/${gameId}/moves`),
      ]);
      const gameData = await gameRes.json();
      const movesData = await movesRes.json();
      setGame(gameData);
      setMoves(movesData);
    } catch (error) {
      console.error('Failed to fetch game data:', error);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentMove(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentMove < moves.length) {
      setCurrentMove(currentMove + 1);
    }
  };

  const handleStepBack = () => {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/history">
            <Button variant="ghost" className="text-slate-300 hover:text-purple-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to History
            </Button>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-slate-800/80 border-slate-700 shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl">Game Replay</CardTitle>
                {game.winner && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Trophy className="h-5 w-5" />
                    <span className="font-bold">{game.winner.username} won!</span>
                  </div>
                )}
                {!game.winner && (
                  <span className="text-orange-400 font-bold">Draw</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-900 rounded-lg">
                <div>
                  <div className="text-cyan-400 font-bold">{game.player1.username}</div>
                  <div className="text-white text-xl font-black">X</div>
                </div>
                <div className="text-slate-500">VS</div>
                <div className="text-right">
                  <div className="text-pink-400 font-bold">{game.player2?.username}</div>
                  <div className="text-white text-xl font-black">O</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 aspect-square">
                {board.map((cell, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square rounded-xl border-2 flex items-center justify-center text-4xl font-black
                      ${
                        cell === 'X'
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                          : cell === 'O'
                          ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                          : 'border-slate-600 bg-slate-800'
                      }
                    `}
                  >
                    {cell || ''}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Move {currentMove} of {moves.length}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReset}
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                    >
                      Reset
                    </Button>
                    <Button onClick={handleStepBack} size="sm" variant="outline" className="border-slate-600">
                      ←
                    </Button>
                    <Button
                      onClick={handlePlayPause}
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      {isPlaying ? (
                        <PauseCircle className="h-4 w-4" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button onClick={handleStepForward} size="sm" variant="outline" className="border-slate-600">
                      →
                    </Button>
                  </div>
                </div>

                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${(currentMove / moves.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 max-h-48 overflow-y-auto">
                <h3 className="text-white font-bold mb-2">Move History</h3>
                <div className="space-y-1">
                  {moves.map((move, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded ${
                        index < currentMove
                          ? 'text-white bg-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {index + 1}. {move.playerId.username} played {move.symbol} at position{' '}
                      {move.position + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
