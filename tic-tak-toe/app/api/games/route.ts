import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import Player from '@/models/Player';

export async function POST(request: Request) {
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

    const game = await Game.create({
      player1: playerId,
      status: 'open',
      currentTurn: 'X',
      board: [null, null, null, null, null, null, null, null, null],
    });

    const populatedGame = await Game.findById(game._id)
      .populate('player1', 'username')
      .populate('player2', 'username');

    return NextResponse.json(populatedGame);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
