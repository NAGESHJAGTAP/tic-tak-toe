'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, Users, Trophy, Sparkles, Play } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [openGames, setOpenGames] = useState<any[]>([]);
  const [showJoinGames, setShowJoinGames] = useState(false);

  const handleCreateGame = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const playerRes = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!playerRes.ok) {
        const error = await playerRes.json();
        alert(error.error || 'Failed to create player');
        return;
      }

      const player = await playerRes.json();

      const gameRes = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: player._id }),
      });

      if (!gameRes.ok) {
        const error = await gameRes.json();
        alert(error.error || 'Failed to create game');
        return;
      }

      const game = await gameRes.json();

      localStorage.setItem('playerId', player._id);
      localStorage.setItem('username', player.username);
      router.push(`/game/${game._id}`);
    } catch (error) {
      alert('Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const handleShowJoinGames = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/games/open');
      const games = await response.json();
      setOpenGames(games);
      setShowJoinGames(true);
    } catch (error) {
      alert('Failed to fetch open games');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const playerRes = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!playerRes.ok) {
        const error = await playerRes.json();
        alert(error.error || 'Failed to create player');
        return;
      }

      const player = await playerRes.json();

      const joinRes = await fetch(`/api/games/${gameId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: player._id }),
      });

      if (!joinRes.ok) {
        const error = await joinRes.json();
        alert(error.error || 'Failed to join game');
        return;
      }

      localStorage.setItem('playerId', player._id);
      localStorage.setItem('username', player.username);
      router.push(`/game/${gameId}`);
    } catch (error) {
      alert('Failed to join game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-game-x/20 via-transparent to-game-o/20"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto space-y-6">
          <Card className="bg-slate-800/80 border-slate-700 shadow-2xl backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Start Playing</CardTitle>
              <CardDescription>Enter your username to begin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateGame()}
              />

              <div className="space-y-3">
              <Button
                onClick={handleCreateGame}
                disabled={loading}
                className="w-full bg-gradient-to-r from-game-x to-game-x/80 hover:from-game-x/80 hover:to-game-x text-white font-semibold py-6 text-lg"
              >
                {loading ? 'Creating...' : 'Create New Game'}
              </Button>

              <Button
                onClick={handleShowJoinGames}
                disabled={loading}
                variant="outline"
                className="w-full border-game-o text-game-o hover:bg-game-o/10 font-semibold py-6 text-lg"
              >
                {loading ? 'Loading...' : 'Join Open Game'}
              </Button>
              </div>
            </CardContent>
          </Card>

          {showJoinGames && (
            <Card className="bg-slate-800/80 border-slate-700 shadow-2xl backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Open Games</CardTitle>
                <CardDescription>Join an existing game</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {openGames.length === 0 ? (
                  <p className="text-center text-slate-400 py-4">No open games available</p>
                ) : (
                  openGames.map((game) => (
                    <div
                      key={game._id}
                      className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-game-o/50 transition-colors"
                    >
                      <div>
                        <p className="text-white font-semibold">{game.player1.username}</p>
                        <p className="text-sm text-slate-400">Waiting for opponent...</p>
                      </div>
                      <Button
                        onClick={() => handleJoinGame(game._id)}
                        disabled={loading}
                        size="sm"
                        className="bg-game-o hover:bg-game-o/80"
                      >
                        Join
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3 justify-center">
            <Link href="/leaderboard">
              <Button variant="ghost" className="text-slate-300 hover:text-game-x">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="ghost" className="text-slate-300 hover:text-game-o">
                <Users className="h-4 w-4 mr-2" />
                History
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
