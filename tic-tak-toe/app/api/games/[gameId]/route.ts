import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    await dbConnect();
    const game = await Game.findById(params.gameId)
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username')
      .lean();

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}
