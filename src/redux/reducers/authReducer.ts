import { Action } from "redux"
import { AuthActionType, LoginAction, ScoreAction } from "../actions/auth/definitions"
import { AuthState } from '../state'; 

const initialState: AuthState = {
  logged: false
}

const authReducer = (state = initialState, action: Action<AuthActionType>) => {
  switch(action.type) {
    case AuthActionType.LOGIN: {
      const { payload } = action as LoginAction;
      return {
        logged: true,
        ...payload
      }
    }
    case AuthActionType.LOGOUT: {
      return {
        logged: false
      }
    }
    case AuthActionType.SCORE: {
      const { payload: { score } } = action as ScoreAction;

      return {
        ...state,
        score
      }
    }
    default: return state
  }
}

export default authReducer;