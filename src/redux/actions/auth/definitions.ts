import { Action } from "redux";

export enum AuthActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SCORE = 'SCORE'
}

export interface LoginPayload {
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  joined: Date,
  score: number,
  token: string
};

export interface LoginAction extends Action<AuthActionType> {
  type: AuthActionType.LOGIN,
  payload: LoginPayload
}

export interface LogoutAction extends Action<AuthActionType> {
  type: AuthActionType.LOGOUT
}

export interface ScorePayload {
  score: number
}

export interface ScoreAction extends Action<AuthActionType> {
  type: AuthActionType.SCORE,
  payload: ScorePayload
}