import { Action } from "redux";
import Colors from "../../../components/game/board/constants/Colors";
import PieceTypes from "../../../components/game/board/constants/PieceTypes";
import { ModeType, Opponent } from "../../state";

export enum GameActionType {
  MOVE = 'MOVE',
  CHECK = 'CHECK',
  WINNER = 'WINNER',
  DRAW = 'DRAW',
  CAPTURE = 'CAPTURE',
  RESET = 'RESET',
  START = 'START',
  SIDE = 'SIDE',
  REVERT = 'REVERT',
  MODE = 'MODE',
  PROMOTE = 'PROMOTE',
  TURN = 'TURN'
}

export interface MovePayload {
  pieceId: string,
  target: number
};

export interface MoveAction extends Action<GameActionType> {
  type: GameActionType.MOVE,
  payload: MovePayload
}

export interface CapturePayload {
  pieceId: string
};

export interface CaptureAction extends Action<GameActionType> {
  type: GameActionType.CAPTURE,
  payload: CapturePayload
}

export interface CheckPayload {
  colorInCheck: Colors | null
};
export interface CheckAction extends Action<GameActionType> {
  type: GameActionType.CHECK,
  payload: CheckPayload
}

export interface WinnerPayload {
  color: Colors
}

export interface WinnerAction extends Action<GameActionType> {
  type: GameActionType.WINNER,
  payload: WinnerPayload
}

export interface DrawAction extends Action<GameActionType> {
  type: GameActionType.DRAW
}
export interface ResetAction extends Action<GameActionType> {
  type: GameActionType.RESET
}

export interface StartPayload {
  color: Colors,
  mode: ModeType,
  opponent: Opponent
}
export interface StartAction extends Action<GameActionType> {
  type: GameActionType.START,
  payload: StartPayload
}

export enum RevertDirection { 
  FIRST = 'FIRST',
  LAST = 'LAST',
  PREVIOUS = 'PREVIOUS',
  NEXT = 'NEXT'
}

export interface RevertPayload {
  direction: RevertDirection
}

export interface RevertAction extends Action<GameActionType> {
  type: GameActionType.REVERT,
  payload: RevertPayload
}

export interface PromotePayload {
  replacedId: string,
  type: PieceTypes
}

export interface PromoteAction extends Action<GameActionType> {
  type: GameActionType.PROMOTE,
  payload: PromotePayload
}

export interface TurnAction extends Action<GameActionType> {
  type: GameActionType.TURN
}