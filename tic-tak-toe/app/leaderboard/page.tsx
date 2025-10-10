import { Metadata } from 'next';
import Link from 'next/link';
import { Trophy, Medal, Award, ArrowLeft, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

export const metadata: Metadata = {
  title: 'Leaderboard | Tic Tac Toe Multiplayer',
  description: 'View the top players and compete for the highest rank in Tic Tac Toe',
};

async function getPlayers() {
  try {
    await dbConnect();
    const players = await Player.find({})
      .sort({ wins: -1, losses: 1 })
      .limit(50)
      .lean();

    return players.map((player: any) => ({
      _id: player._id.toString(),
      username: player.username,
      wins: player.wins,
      losses: player.losses,
      draws: player.draws,
      winRate: player.wins + player.losses > 0
        ? ((player.wins / (player.wins + player.losses)) * 100).toFixed(1)
        : '0.0',
      totalGames: player.wins + player.losses + player.draws,
    }));
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return [];
  }
}

export default async function LeaderboardPage() {
  const players = await getPlayers();

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (index === 1) return <Medal className="h-6 w-6 text-slate-300" />;
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-cyan-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-12 w-12 text-yellow-400" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <p className="text-slate-300 text-lg">Top players ranked by victories</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {players.length === 0 ? (
            <Card className="bg-slate-800/80 border-slate-700">
              <CardContent className="py-12 text-center">
                <p className="text-slate-400">No players yet. Be the first to play!</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/80 border-slate-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Top Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div
                      key={player._id}
                      className={`
                        flex items-center gap-4 p-4 rounded-lg border transition-all
                        ${
                          index < 3
                            ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-yellow-500/30'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-700">
                        {getRankIcon(index) || (
                          <span className="text-slate-400 font-bold">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{player.username}</h3>
                        <p className="text-sm text-slate-400">
                          {player.totalGames} games • {player.winRate}% win rate
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="text-green-400 font-bold text-xl">{player.wins}</div>
                          <div className="text-xs text-slate-500 uppercase">Wins</div>
                        </div>
                        <div>
                          <div className="text-red-400 font-bold text-xl">{player.losses}</div>
                          <div className="text-xs text-slate-500 uppercase">Losses</div>
                        </div>
                        <div>
                          <div className="text-yellow-400 font-bold text-xl">{player.draws}</div>
                          <div className="text-xs text-slate-500 uppercase">Draws</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
