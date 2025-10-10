import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

export async function GET() {
  try {
    await dbConnect();
    const players = await Player.find({}).sort({ wins: -1 }).lean();
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username || username.trim().length === 0) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    await dbConnect();

    let player = await Player.findOne({ username: username.trim() });

    if (!player) {
      player = await Player.create({ username: username.trim() });
    }

    return NextResponse.json(player);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
