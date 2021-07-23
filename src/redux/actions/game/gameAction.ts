import Colors from "../../../components/game/board/constants/Colors";
import PieceTypes from "../../../components/game/board/constants/PieceTypes";
import { ModeType, Opponent } from "../../state";
import { CaptureAction, CheckAction, TurnAction, DrawAction, GameActionType, MoveAction, PromoteAction, ResetAction, RevertAction, RevertDirection, StartAction, WinnerAction } from "./definitions"

// export const moveSocketActionCreator = (pieceId: string, target: number): ThunkAction<void, any, any, any> => {
//   return (dispatch) => {
//     socket.emit('move', { pieceId, target });

//     dispatch(moveActionCreator(pieceId, target));
//   }
// }

export const moveActionCreator = (pieceId: string, target: number): MoveAction => {
  const payload =  {
    pieceId, target
  };
  
  return {
    type: GameActionType.MOVE,
    payload
  }
};

export const checkActionCreator = (colorInCheck: Colors | null): CheckAction => {
  return {
    type: GameActionType.CHECK,
    payload: { colorInCheck }
  }
};

export const winnerActionCreator = (winnerColor: Colors): WinnerAction => {
  return {
    type: GameActionType.WINNER,
    payload: {
      color: winnerColor
    }
  }
};

export const drawActionCreator = (): DrawAction => {
  return {
    type: GameActionType.DRAW
  }
};

export const captureActionCreator = (pieceId: string): CaptureAction => {
  return {
    type: GameActionType.CAPTURE,
    payload: {
      pieceId
    }
  }
}

export const resetActionCreator = (): ResetAction => {
  return {
    type: GameActionType.RESET,
  }
}

export const startActionCreator = (color: Colors, mode: ModeType, opponent: Opponent): StartAction => {
  return {
    type: GameActionType.START,
    payload: {
      color,
      mode,
      opponent
    }
  }
}

export const revertActionCreator = (direction: RevertDirection): RevertAction => {
  return {
    type: GameActionType.REVERT,
    payload: {
      direction
    }
  }
}

export const promoteActionCreator = (replacedId: string, type: PieceTypes): PromoteAction => {
  return {
    type: GameActionType.PROMOTE,
    payload: {
      replacedId,
      type
    }
  }
}

export const turnActionCreator = (): TurnAction => {
  return {
    type: GameActionType.TURN
  }
}