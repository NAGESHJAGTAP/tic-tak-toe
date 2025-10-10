import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import Player from '@/models/Player';

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId } = await request.json();

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    await dbConnect();

    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const game = await Game.findById(params.gameId);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'open') {
      return NextResponse.json({ error: 'Game is not open' }, { status: 400 });
    }

    if (game.player1.toString() === playerId) {
      return NextResponse.json({ error: 'Cannot join your own game' }, { status: 400 });
    }

    game.player2 = playerId as any;
    game.status = 'active';
    await game.save();

    const populatedGame = await Game.findById(game._id)
      .populate('player1', 'username')
      .populate('player2', 'username');

    return NextResponse.json(populatedGame);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}
