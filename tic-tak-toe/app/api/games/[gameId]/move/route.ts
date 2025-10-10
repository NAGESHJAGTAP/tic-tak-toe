import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import Move from '@/models/Move';
import Player from '@/models/Player';

function checkWinner(board: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function isBoardFull(board: (string | null)[]): boolean {
  return board.every((cell) => cell !== null);
}

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId, position } = await request.json();

    if (!playerId || position === undefined) {
      return NextResponse.json({ error: 'Player ID and position are required' }, { status: 400 });
    }

    if (position < 0 || position > 8) {
      return NextResponse.json({ error: 'Invalid position' }, { status: 400 });
    }

    await dbConnect();

    const game = await Game.findById(params.gameId);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'active') {
      return NextResponse.json({ error: 'Game is not active' }, { status: 400 });
    }

    if (game.board[position]) {
      return NextResponse.json({ error: 'Position already taken' }, { status: 400 });
    }

    const isPlayer1 = game.player1.toString() === playerId;
    const isPlayer2 = game.player2?.toString() === playerId;

    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json({ error: 'You are not a player in this game' }, { status: 403 });
    }

    const playerSymbol = isPlayer1 ? 'X' : 'O';

    if (game.currentTurn !== playerSymbol) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 400 });
    }

    game.board[position] = playerSymbol;

    await Move.create({
      gameId: game._id,
      playerId,
      position,
      symbol: playerSymbol,
    });

    const winner = checkWinner(game.board);

    if (winner) {
      game.status = 'finished';
      game.winner = isPlayer1 ? game.player1 : game.player2;
      game.endedAt = new Date();

      await Player.findByIdAndUpdate(game.winner, { $inc: { wins: 1 } });
      const loserId = isPlayer1 ? game.player2 : game.player1;
      await Player.findByIdAndUpdate(loserId, { $inc: { losses: 1 } });
    } else if (isBoardFull(game.board)) {
      game.status = 'finished';
      game.endedAt = new Date();

      await Player.findByIdAndUpdate(game.player1, { $inc: { draws: 1 } });
      await Player.findByIdAndUpdate(game.player2, { $inc: { draws: 1 } });
    } else {
      game.currentTurn = game.currentTurn === 'X' ? 'O' : 'X';
    }

    await game.save();

    const populatedGame = await Game.findById(game._id)
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username');

    return NextResponse.json(populatedGame);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to make move' }, { status: 500 });
  }
}
