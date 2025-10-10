import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Move from '@/models/Move';

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    await dbConnect();
    const moves = await Move.find({ gameId: params.gameId })
      .populate('playerId', 'username')
      .sort({ timestamp: 1 })
      .lean();

    return NextResponse.json(moves);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch moves' }, { status: 500 });
  }
}
