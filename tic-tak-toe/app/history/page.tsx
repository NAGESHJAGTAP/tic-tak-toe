'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, ArrowLeft, Trophy, XCircle, MinusCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function HistoryPage() {
  const [playerId, setPlayerId] = useState('');
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedPlayerId = localStorage.getItem('playerId');
    const storedUsername = localStorage.getItem('username');
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
      setUsername(storedUsername || '');
      fetchHistory(storedPlayerId);
    }
  }, []);

  const fetchHistory = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history/${id}`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchHistory = async () => {
    if (!playerId.trim()) {
      return;
    }
    await fetchHistory(playerId.trim());
  };

  const getGameResult = (game: any) => {
    if (!game.winner) {
      return { text: 'Draw', icon: MinusCircle, color: 'text-yellow-400' };
    }
    if (game.winner._id === playerId) {
      return { text: 'Victory', icon: Trophy, color: 'text-green-400' };
    }
    return { text: 'Defeat', icon: XCircle, color: 'text-red-400' };
  };

  const getOpponent = (game: any) => {
    if (game.player1._id === playerId) {
      return game.player2?.username || 'Unknown';
    }
    return game.player1.username;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-pink-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <History className="h-12 w-12 text-pink-400" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Game History
            </h1>
          </div>
          <p className="text-slate-300 text-lg">Review your past matches and performance</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {!username && (
            <Card className="bg-slate-800/80 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Find Your History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter your player ID"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white"
                />
                <Button
                  onClick={handleFetchHistory}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  View History
                </Button>
              </CardContent>
            </Card>
          )}

          {username && (
            <Card className="bg-slate-800/80 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  {username}'s Match History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-slate-400">Loading...</div>
                ) : games.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    No games played yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {games.map((game) => {
                      const result = getGameResult(game);
                      const opponent = getOpponent(game);
                      const ResultIcon = result.icon;

                      return (
                        <div
                          key={game._id}
                          className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex items-center justify-center w-12 h-12 rounded-full ${
                                result.text === 'Victory'
                                  ? 'bg-green-500/20'
                                  : result.text === 'Defeat'
                                  ? 'bg-red-500/20'
                                  : 'bg-yellow-500/20'
                              }`}
                            >
                              <ResultIcon className={`h-6 w-6 ${result.color}`} />
                            </div>

                            <div>
                              <h3 className={`font-bold text-lg ${result.color}`}>
                                {result.text}
                              </h3>
                              <p className="text-sm text-slate-400">vs {opponent}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-slate-500">
                              {new Date(game.endedAt).toLocaleDateString()}
                            </p>
                            <Link href={`/history/${game._id}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-pink-400 hover:text-pink-300 mt-1"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
