import mongoose from 'mongoose';

export interface IPlayer extends mongoose.Document {
  username: string;
  wins: number;
  losses: number;
  draws: number;
  createdAt: Date;
}

const PlayerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  draws: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
