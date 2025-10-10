import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';

export async function GET() {
  try {
    await dbConnect();
    const games = await Game.find({ status: 'open' })
      .populate('player1', 'username')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch open games' }, { status: 500 });
  }
}
