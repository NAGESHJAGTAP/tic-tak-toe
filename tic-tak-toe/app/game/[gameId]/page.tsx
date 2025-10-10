'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameBoard from '@/components/GameBoard';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const storedPlayerId = localStorage.getItem('playerId');
    if (!storedPlayerId) {
      router.push('/');
    } else {
      setPlayerId(storedPlayerId);
    }
  }, [router]);

  if (!playerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-game-x/20 via-game-o/10 to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-game-x">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-game-o">
              <Home className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </Link>
        </div>

        <GameBoard gameId={gameId} playerId={playerId} />
      </div>
    </div>
  );
}
