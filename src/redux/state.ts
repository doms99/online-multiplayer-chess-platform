import Colors from "../components/game/board/constants/Colors";
import PieceTypes from "../components/game/board/constants/PieceTypes";

export interface FullState {
  auth: AuthState,
  game: GameState
}

export interface AuthState {
  logged: boolean,
  username?: string,
  firstName?: string,
  lastName?: string,
  email?: string, 
  score?: number,
  token?: string,
  joined?: Date
}

export interface GameState {
  started: boolean,
  pieces: GamePieceState,
  turn: Colors,
  check: Colors | null,
  moveHistory: MoveHistoryEntry[],
  lastMove: LastMoveInterface | null,
  winner: 'draw' | Colors | null,
  side: Colors,
  reverted: number | null,
  mode: ModeType,
  opponent: Opponent
}

export interface Opponent {
  username: string,
  score: number
}

export type RematchRequestType = 'recieved' | 'sent';

export type ModeType = 'alone' | 'computer' | 'multi';

export interface MoveHistoryEntry {
  description: string,
  old: GamePieceState,
  new: GamePieceState,
  moveAdded: boolean
}

export interface LastMoveInterface {
  piece: PieceGameData, 
  previous: number, 
  current: number
};

export interface PieceData {
  id: string, 
  type: PieceTypes, 
  color: Colors
};

export interface PieceGameData extends PieceData {
  position: number, 
  moved: boolean
}

export type GamePieceState = Record<string, PieceGameData>;