import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';

export async function GET(
  request: Request,
  { params }: { params: { playerId: string } }
) {
  try {
    await dbConnect();
    const games = await Game.find({
      $or: [{ player1: params.playerId }, { player2: params.playerId }],
      status: 'finished',
    })
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username')
      .sort({ endedAt: -1 })
      .lean();

    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game history' }, { status: 500 });
  }
}
