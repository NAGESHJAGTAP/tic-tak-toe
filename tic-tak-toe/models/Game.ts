import mongoose from 'mongoose';

export interface IGame extends mongoose.Document {
  player1: mongoose.Types.ObjectId;
  player2?: mongoose.Types.ObjectId;
  status: 'open' | 'active' | 'finished';
  winner?: mongoose.Types.ObjectId;
  currentTurn: 'X' | 'O';
  board: (string | null)[];
  createdAt: Date;
  endedAt?: Date;
}

const GameSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  status: {
    type: String,
    enum: ['open', 'active', 'finished'],
    default: 'open',
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  currentTurn: {
    type: String,
    enum: ['X', 'O'],
    default: 'X',
  },
  board: {
    type: [String],
    default: [null, null, null, null, null, null, null, null, null],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
});

export default mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);
