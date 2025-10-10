import mongoose from 'mongoose';

export interface IMove extends mongoose.Document {
  gameId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  position: number;
  symbol: 'X' | 'O';
  timestamp: Date;
}

const MoveSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  position: {
    type: Number,
    required: true,
    min: 0,
    max: 8,
  },
  symbol: {
    type: String,
    enum: ['X', 'O'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Move || mongoose.model<IMove>('Move', MoveSchema);
