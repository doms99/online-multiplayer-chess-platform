import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { resetActionCreator } from "../game/gameAction";
import { AuthActionType, LoginAction, LoginPayload, ScoreAction } from "./definitions"

export const loginActionCreator = (payload: LoginPayload): LoginAction => {
  return {
    type: AuthActionType.LOGIN,
    payload
  }
};

export const logoutActionCreator = (): ThunkAction<void, any, any, Action<any>> => {
  return (dispatch) => {
    dispatch(resetActionCreator());
    dispatch({type: AuthActionType.LOGOUT});
  }
};

export const scoreActionCreator = (score: number): ScoreAction => {
  return {
    type: AuthActionType.SCORE,
    payload: {
      score
    }
  }
}