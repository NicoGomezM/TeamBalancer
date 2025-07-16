import mongoose from 'mongoose';

export interface IPlayer {
  id: string;
  name: string;
  position: string;
  skill: number;
  isPresent: boolean;
}

export interface ITeam {
  name: string;
  players: IPlayer[];
  totalSkill: number;
}

export interface IGroupPlayer {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  isActive: boolean;
}

export interface IGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  players: IGroupPlayer[];
  isActive: boolean;
}

export interface IVote {
  id: string;
  groupId: string;
  fromPlayerId: string;
  toPlayerId: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlayerStats {
  id: string;
  name: string;
  nickname: string;
  groupId: string;
  totalPoints: number;
  voteCount: number;
  averagePoints: number;
  isPresent: boolean;
  hasVoted: boolean;
}

const GroupPlayerSchema = new mongoose.Schema<IGroupPlayer>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  avatar: { type: String, default: '👨‍🎓' },
  isActive: { type: Boolean, default: true }
});

const GroupSchema = new mongoose.Schema<IGroup>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  icon: { type: String, default: '🎓' },
  color: { type: String, default: 'bg-blue-500' },
  players: [GroupPlayerSchema],
  isActive: { type: Boolean, default: true, index: true }
}, {
  timestamps: true
});

const VoteSchema = new mongoose.Schema<IVote>({
  id: { type: String, required: true },
  groupId: { type: String, required: true, index: true },
  fromPlayerId: { type: String, required: true, index: true },
  toPlayerId: { type: String, required: true, index: true },
  points: { type: Number, required: true, min: 1, max: 10 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Índice compuesto para evitar votos duplicados
VoteSchema.index({ groupId: 1, fromPlayerId: 1, toPlayerId: 1 }, { unique: true });

const PlayerSchema = new mongoose.Schema<IPlayer>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  skill: { type: Number, required: true, min: 1, max: 10 },
  isPresent: { type: Boolean, default: true }
});

const TeamSchema = new mongoose.Schema<ITeam>({
  name: { type: String, required: true },
  players: [PlayerSchema],
  totalSkill: { type: Number, required: true, default: 0 }
});

const TeamBalanceSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  players: [PlayerSchema],
  teams: [TeamSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const GroupPlayer = mongoose.models.GroupPlayer || mongoose.model<IGroupPlayer>('GroupPlayer', GroupPlayerSchema);
export const Group = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
export const Player = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
export const TeamBalance = mongoose.models.TeamBalance || mongoose.model('TeamBalance', TeamBalanceSchema);
export const Vote = mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);
