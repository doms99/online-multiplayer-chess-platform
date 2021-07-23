import { Action } from "redux"
import Colors from "../../components/game/board/constants/Colors";
import PieceTypes from "../../components/game/board/constants/PieceTypes";
import { MoveAction, GameActionType, CheckAction, WinnerAction, CaptureAction, StartAction, RevertAction, RevertDirection, PromoteAction } from "../actions/game/definitions"
import { GamePieceState, GameState, MoveHistoryEntry, PieceGameData } from '../state'; 

export const startingGamePieces: GamePieceState = {
  black_rook1: {
    id: 'black_rook1',
    type: PieceTypes.rook,
    color: Colors.black,
    position: 0,
    moved: false
  },
  black_knight1: {
    id: 'black_knight1',
    type: PieceTypes.knight,
    color: Colors.black,
    position: 1,
    moved: false
  },
  black_bishop1: {
    id: 'black_bishop1',
    type: PieceTypes.bishop,
    color: Colors.black,
    position: 2,
    moved: false
  },
  black_queen: {
    id: 'black_queen',
    type: PieceTypes.queen,
    color: Colors.black,
    position: 3,
    moved: false
  },
  black_king: {
    id: 'black_king',
    type: PieceTypes.king,
    color: Colors.black,
    position: 4,
    moved: false
  },
  black_bishop2: {
    id: 'black_bishop2',
    type: PieceTypes.bishop,
    color: Colors.black,
    position: 5,
    moved: false
  },
  black_knight2: {
    id: 'black_knight2',
    type: PieceTypes.knight,
    color: Colors.black,
    position: 6,
    moved: false
  },
  black_rook2: {
    id: 'black_rook2',
    type: PieceTypes.rook,
    color: Colors.black,
    position: 7,
    moved: false
  },
  black_pawn1: {
    id: 'black_pawn1',
    type: PieceTypes.pawn,
    color: Colors.black,
    position: 8,
    moved: false
  },
  black_pawn2: {
    id: 'black_pawn2',
    type: PieceTypes.pawn,
    color: Colors.black,
    position: 9,
    moved: false
  },
  black_pawn3: {
    id: 'black_pawn3',
    type: PieceTypes.pawn,
    color: Colors.black,
    position: 10,
    moved: false
  },
  black_pawn4: {
    id: 'black_pawn4',
    type: PieceTypes.pawn,
    color: Colors.black,
    position: 11,
    moved: false
  },
  black_pawn5: {
    id: 'black_pawn5',
    type: PieceTypes.pawn,
    color: Colors.black,
    position: 12,
    moved: false
  },
  black_pawn6: {
    id: 'black_pawn6',
    type: PieceTypes.pawn,
    color: Colors.black,
    position: 13,
    moved: false
  },
  black_pawn7: {
    id: 'black_pawn7',
    type: PieceTypes.pawn,
    color: Colors.black,
    position: 14,
    moved: false
  },
  black_pawn8: {
    id: 'black_pawn8',
    type: PieceTypes.pawn,
    color: Colors.black,
    position: 15,
    moved: false
  },
  white_pawn1: {
    id: 'white_pawn1',
    type: PieceTypes.pawn,
    color: Colors.white,
    position: 48,
    moved: false
  },
  white_pawn2: {
    id: 'white_pawn2',
    type: PieceTypes.pawn,
    color: Colors.white,
    position: 49,
    moved: false
  },
  white_pawn3: {
    id: 'white_pawn3',
    type: PieceTypes.pawn,
    color: Colors.white,
    position: 50,
    moved: false
  },
  white_pawn4: {
    id: 'white_pawn4',
    type: PieceTypes.pawn,
    color: Colors.white,
    position: 51,
    moved: false
  },
  white_pawn5: {
    id: 'white_pawn5',
    type: PieceTypes.pawn,
    color: Colors.white,
    position: 52,
    moved: false
  },
  white_pawn6: {
    id: 'white_pawn6',
    type: PieceTypes.pawn,
    color: Colors.white,
    position: 53,
    moved: false
  },
  white_pawn7: {
    id: 'white_pawn7',
    type: PieceTypes.pawn,
    color: Colors.white,
    position: 54,
    moved: false
  },
  white_pawn8: {
    id: 'white_pawn8',
    type: PieceTypes.pawn,
    color: Colors.white,
    position: 55,
    moved: false
  },
  white_rook1: {
    id: 'white_rook1',
    type: PieceTypes.rook,
    color: Colors.white,
    position: 56,
    moved: false
  },
  white_knight1: {
    id: 'white_knight1',
    type: PieceTypes.knight,
    color: Colors.white,
    position: 57,
    moved: false
  },
  white_bishop1: {
    id: 'white_bishop1',
    type: PieceTypes.bishop,
    color: Colors.white,
    position: 58,
    moved: false
  },
  white_queen: {
    id: 'white_queen',
    type: PieceTypes.queen,
    color: Colors.white,
    position: 59,
    moved: false
  },
  white_king: {
    id: 'white_king',
    type: PieceTypes.king,
    color: Colors.white,
    position: 60,
    moved: false
  },
  white_bishop2: {
    id: 'white_bishop2',
    type: PieceTypes.bishop,
    color: Colors.white,
    position: 61,
    moved: false
  },
  white_knight2: {
    id: 'white_knight2',
    type: PieceTypes.knight,
    color: Colors.white,
    position: 62,
    moved: false
  },
  white_rook2: {
    id: 'white_rook2',
    type: PieceTypes.rook,
    color: Colors.white,
    position: 63,
    moved: false
  }
};

const initialState: GameState = {
  started: false,
  pieces: startingGamePieces,
  turn: Colors.white,
  check: null,
  moveHistory: [],
  lastMove: null,
  winner: null,
  side: Colors.white,
  reverted: null,
  mode: 'alone',
  opponent: { username: 'Opponent', score: 800}
}

const gameReducer = (state: GameState = initialState, action: Action<GameActionType>) => {
  switch(action.type) {
    case GameActionType.START: {
      const { payload: { color, mode, opponent } } = action as StartAction; 

      return {
        ...initialState,
        started: true,
        side: color,
        mode,
        opponent
      }
    }
    case GameActionType.MOVE: {
      const { payload: { pieceId, target } } = action as MoveAction;

      return move(state, pieceId, target);
    }
    case GameActionType.CHECK: {
      const { payload: { colorInCheck } } = action as CheckAction;
      
      return {
        ...state,
        check: colorInCheck
      }
    }
    case GameActionType.CAPTURE: {
      const { payload: { pieceId } } = action as CaptureAction;
      
      return capture(state, pieceId)
    }
    case GameActionType.RESET: {
      return {
        ...initialState
      };
    }
    case GameActionType.WINNER: {
      const { payload: { color } } = action as WinnerAction;
      if(state.winner === color) return state;
      return {
        ...state,
        winner: color
      }
    }
    case GameActionType.DRAW: {
      return {
        ...state,
        winner: 'draw'
      }
    }
    case GameActionType.REVERT: {
      const { payload: { direction } } = action as RevertAction;
      
      return {
        ...state,
        ...revert(state.moveHistory, state.reverted, state.pieces, direction)
      };
    }
    case GameActionType.PROMOTE: {
      const { payload: { replacedId, type } } = action as PromoteAction;
      
      return {
        ...state,
        pieces: {
          ...state.pieces,
          [replacedId] : {
            ...state.pieces[replacedId],
            type
          }
        }        
      };
    }
    case GameActionType.TURN: {
      return {
        ...state,
        turn: state.turn === Colors.white ? Colors.black : Colors.white
      };
    }
    default: return state
  }
}

const move = (state: GameState, pieceId: string, target: number): GameState => {
  const pieces = movePieces(state.pieces, pieceId, target);
  const moveHistory = moveMoveHistoryEntry(state.moveHistory, pieceId, state.pieces[pieceId], pieces[pieceId]);

  return {
    ...state,
    pieces,
    moveHistory,
    lastMove: {piece: state.pieces[pieceId], previous: state.pieces[pieceId].position, current: target}
  };
}

export const moveMoveHistoryEntry = (moveHistory: MoveHistoryEntry[], pieceId: string, oldPiece: PieceGameData, newPiece: PieceGameData) => {
  let lastEntry: MoveHistoryEntry;
  let newMoveHistory: MoveHistoryEntry[];
  if(moveHistory.length === 0 || moveHistory[moveHistory.length-1].moveAdded) {
    newMoveHistory = [...moveHistory];
    const column = String.fromCharCode(97 + (newPiece.position % 8));
    const row = 8 - Math.floor(newPiece.position / 8);
    
    lastEntry = {
      old: {[pieceId]: oldPiece},
      new: {[pieceId]: newPiece}, 
      description: `${newPiece.type} to ${column}${row}`,
      moveAdded: true
    }
  } else {
    lastEntry = moveHistory[moveHistory.length-1];
    newMoveHistory = moveHistory.slice(0, -1);
    
    lastEntry = {
      ...lastEntry,
      old: {
        ...lastEntry.old,
        [pieceId]: oldPiece
      },
      new: {
        ...lastEntry.new,
        [pieceId]: newPiece
      },
      moveAdded: true
    }
  }

  newMoveHistory.push(lastEntry);

  return newMoveHistory;
}

export const movePieces = (pieces: GamePieceState, pieceId: string, target: number): GamePieceState => {
  return {
    ...pieces,
    [pieceId]: {
      ...pieces[pieceId],
      moved: true,
      position: target
    }
  }
}

const capture = (state: GameState, pieceId: string): GameState => {
  console.log('capture');
  
  const pieces = capturePieces(state.pieces, pieceId);
  const moveHistory = captureMoveHistoryEntry(state.moveHistory, pieceId, state.pieces[pieceId], pieces[pieceId]);
  
  return {
    ...state,
    pieces,
    moveHistory
  };
}

export const captureMoveHistoryEntry = (moveHistory: MoveHistoryEntry[], pieceId: string, oldPiece: PieceGameData, newPiece: PieceGameData) => {
  const column = String.fromCharCode(97 + (oldPiece.position % 8));
  const row = 8 - Math.floor(oldPiece.position / 8);

  let lastEntry = {
    old: {[pieceId]: oldPiece},
    new: {[pieceId]: newPiece}, 
    description: `capture on ${column}${row}`,
    moveAdded: false
  };

  return [...moveHistory, lastEntry];
}

export const capturePieces = (pieces: GamePieceState, pieceId: string): GamePieceState => {
  return {
    ...pieces,
    [pieceId]: {
      ...pieces[pieceId],
      position: -1, 
      moved: true
    }
  }
}

export const revert = (moveHistory: MoveHistoryEntry[], reverted: number | null, pieces: GamePieceState, direction: RevertDirection): { reverted: number | null, pieces: GamePieceState } => {
  if(moveHistory.length === 0) return {reverted, pieces};

  switch(direction) {
    case RevertDirection.FIRST: {
      if(reverted !== null && reverted === 0) return {reverted, pieces};

      let newPieces = {...pieces}

      for(let i = !!reverted ? reverted-1 : moveHistory.length-1; i >= 0; i--) {
        newPieces = {
          ...newPieces,
          ...moveHistory[i].old
        }
      }

      return {
        reverted: 0,
        pieces: newPieces
      }
    }
    case RevertDirection.LAST: {
      if(reverted === null) return {reverted, pieces};

      let newPieces = {...pieces}

      for(let i = reverted; i < moveHistory.length; i++) {
        newPieces = {
          ...newPieces,
          ...moveHistory[i].new
        }
      }

      return {
        reverted: null,
        pieces: newPieces
      }
    }
    case RevertDirection.NEXT: {
      if(reverted === null) return {reverted, pieces};

      let newPieces = {
        ...pieces,
        ...moveHistory[reverted].new
      }

      return {
        reverted: moveHistory.length-1 === reverted ? null : reverted+1,
        pieces: newPieces
      }
    }
    case RevertDirection.PREVIOUS: {
      if(reverted !== null && reverted === 0) return {reverted, pieces};

      const index = !!!reverted ? moveHistory.length-1 : reverted-1;

      let newPieces = {
        ...pieces,
        ...moveHistory[index].old
      }

      return {
        reverted: index,
        pieces: newPieces
      }
    }
  }
}

export default gameReducer;